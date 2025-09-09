// "use client";

// import { useFieldArray, useForm } from "react-hook-form";
// import { Fragment, useState } from "react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Plus, X } from "lucide-react";

// const DAYS_OF_WEEK_IN_ORDER = [
//   "MONDAY",
//   "TUESDAY",
//   "WEDNESDAY",
//   "THURSDAY",
//   "FRIDAY",
//   "SATURDAY",
//   "SUNDAY",
// ];

// type Availability = {
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
// };

// type ScheduleFormValues = {
//   labId: string;
//   weeklySchedule: Availability[];
// };

// export function ScheduleForm({ labId }: { labId: string }) {
//   const [successMessage, setSuccessMessage] = useState<string>();
//   const [errorMessage, setErrorMessage] = useState<string>();

//   const form = useForm<ScheduleFormValues>({
//     defaultValues: {
//       labId,
//       weeklySchedule: [],
//     },
//   });

//   const { control, handleSubmit, reset } = form;

//   const { append, remove, fields } = useFieldArray({
//     name: "weeklySchedule",
//     control,
//   });

//   async function onSubmit(values: ScheduleFormValues) {
//     setSuccessMessage(undefined);
//     setErrorMessage(undefined);

//     try {
//       const res = await fetch("/api/schedules", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setErrorMessage(data.error || "Failed to save schedule");
//       } else {
//         setSuccessMessage("✅ Schedule saved!");
//         reset({ labId, weeklySchedule: data.availabilities });
//       }
//     } catch (err) {
//       setErrorMessage("Something went wrong!");
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
//       {errorMessage && <div className="text-red-500">{errorMessage}</div>}
//       {successMessage && <div className="text-green-500">{successMessage}</div>}

//       <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
//         {DAYS_OF_WEEK_IN_ORDER.map((day) => (
//           <Fragment key={day}>
//             <div className="capitalize text-sm font-semibold">{day.slice(0, 3)}</div>
//             <div className="flex flex-col gap-2">
//               <Button
//                 type="button"
//                 className="size-6 p-1"
//                 variant="outline"
//                 onClick={() =>
//                   append({
//                     dayOfWeek: day,
//                     startTime: "09:00",
//                     endTime: "17:00",
//                   })
//                 }
//               >
//                 <Plus className="size-full" />
//               </Button>

//               {fields
//                 .filter((f) => f.dayOfWeek === day)
//                 .map((field, index) => (
//                   <div className="flex gap-2 items-center" key={field.id}>
//                     <Input
//                       {...form.register(`weeklySchedule.${index}.startTime` as const)}
//                       className="w-24"
//                     />
//                     -
//                     <Input
//                       {...form.register(`weeklySchedule.${index}.endTime` as const)}
//                       className="w-24"
//                     />
//                     <Button
//                       type="button"
//                       className="size-6 p-1"
//                     //   variant="destructiveGhost"
//                       onClick={() => remove(index)}
//                     >
//                       <X />
//                     </Button>
//                   </div>
//                 ))}
//             </div>
//           </Fragment>
//         ))}
//       </div>

//       <div className="flex gap-2 justify-end">
//         <Button type="submit">Save</Button>
//       </div>
//     </form>
//   );
// }

'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Check, Loader, Plus, Save, X } from 'lucide-react';
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
        // console.log("Fetched schedules from DB");
      } else {
        console.log('No schedules found for this lab');
      }
    }

    fetchSchedule();
  }, [labId]);

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  // const form = useForm<ScheduleFormValues>({
  //   defaultValues: {
  //     labId,
  //     weeklySchedule: [],
  //   },
  // });

  // console.log("Fetched schedules:", schedules[0]?.availabilities);

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
        setSuccessMessage('Schedule saved ✅');
        reset({ labId, weeklySchedule: data.availabilities });
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Something went wrong!');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {DAYS_OF_WEEK_IN_ORDER.map((day) => (
          <Fragment key={day}>
            {/* Day name + plus icon inline */}
            <div className="flex items-center justify-between">
              <span className="capitalize text-sm font-semibold">
                {day.slice(0, 3)}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  append({
                    dayOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00',
                  })
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Slots */}
            <div className="flex flex-col gap-2">
              {fields
                .filter((f) => f.dayOfWeek === day)
                .map((field) => {
                  const realIndex = fields.findIndex((f) => f.id === field.id); // ✅ get actual index

                  return (
                    <div className="flex gap-2 items-center" key={field.id}>
                      <Input
                        {...form.register(
                          `weeklySchedule.${realIndex}.startTime` as const
                        )}
                        className="w-24 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                      />
                      -
                      <Input
                        {...form.register(
                          `weeklySchedule.${realIndex}.endTime` as const
                        )}
                        className="w-24 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => remove(realIndex)} // ✅ remove correct slot
                      >
                        <X className="w-4 h-8" />
                      </Button>
                    </div>
                  );
                })}
            </div>
          </Fragment>
        ))}
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          className="flex w-36 items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Schedule
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
