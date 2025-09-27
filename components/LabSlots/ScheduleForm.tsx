//components/LabSlots/ScheduleForm.tsx
'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Check, Loader, Plus, Save, X, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

const DAYS_OF_WEEK_IN_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

type Availability = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

type ScheduleFormValues = {
  labId: string;
  weeklySchedule: Availability[];
};

export function ScheduleForm({ labId }: { labId: string }) {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSchedule() {
      if (!labId) return;

      const { data: schedules, error } = await supabase
        .from('schedules')
        .select(
          `
        id,
        createdAt,
        updatedAt,
        availabilities:schedule_availabilities (
          id,
          dayOfWeek,
          startTime,
          endTime
        )
      `
        )
        .eq('labId', labId);

      if (error) {
        console.error('Error fetching schedules:', error);
        return;
      }
      if (schedules) {
        setSchedules(schedules);
      } else {
        console.log('No schedules found for this lab');
      }
    }

    fetchSchedule();
  }, [labId]);

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<ScheduleFormValues>({
    defaultValues: {
      labId,
      weeklySchedule: [
        { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
      ],
    },
  });

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      form.reset({
        labId,
        weeklySchedule: schedules[0].availabilities,
      });
    }
  }, [schedules, labId, form]);

  const { control, handleSubmit, reset } = form;

  const { append, remove, fields } = useFieldArray({
    name: 'weeklySchedule',
    control,
  });

  async function onSubmit(values: ScheduleFormValues) {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save schedule');
        setLoading(false);
      } else {
        setSuccessMessage('Schedule saved successfully!');
        reset({ labId, weeklySchedule: data.availabilities });
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Something went wrong!');
      setLoading(false);
    }
  }

  const getDayFields = (day: string) => {
    return fields.filter((f) => f.dayOfWeek === day);
  };

  const hasDayFields = (day: string) => {
    return getDayFields(day).length > 0;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h4 className="font-semibold text-gray-800">
            Set Weekly Availability
          </h4>
        </div>
        <div className="text-sm text-gray-500">
          {fields.length} time slot(s) configured
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS_OF_WEEK_IN_ORDER.map((day) => (
          <div
            key={day}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            {/* Day Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700 capitalize">
                {day.toLowerCase()}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  append({
                    dayOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00',
                  })
                }
                className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {getDayFields(day).map((field) => {
                const realIndex = fields.findIndex((f) => f.id === field.id);

                return (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 bg-white p-2 rounded border"
                  >
                    <Input
                      type="time"
                      {...form.register(
                        `weeklySchedule.${realIndex}.startTime` as const
                      )}
                      className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500"
                    />
                    <span className="text-gray-400">to</span>
                    <Input
                      type="time"
                      {...form.register(
                        `weeklySchedule.${realIndex}.endTime` as const
                      )}
                      className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(realIndex)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}

              {!hasDayFields(day) && (
                <div className="text-center py-3 text-gray-400 text-sm bg-white rounded border border-dashed">
                  No time slots
                  <Button
                    type="button"
                    variant="link"
                    onClick={() =>
                      append({
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '17:00',
                      })
                    }
                    className="h-auto p-0 ml-1 text-emerald-600 hover:text-emerald-700"
                  >
                    Add slot
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
          <X className="w-4 h-4 mr-2" />
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
          <Check className="w-4 h-4 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="bg-[#006A6A] hover:bg-[#005A5A] text-white px-6 py-2.5 font-medium cursor-pointer"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Schedule
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
