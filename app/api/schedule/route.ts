import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// // Create a schedule with weekly availabilities
// export async function POST(req: Request) {
//   const supabase = await createClient(cookies()); 

//   try {
//     const body = await req.json();
//     const { labId, weeklySchedule } = body;

//     if (!labId || !weeklySchedule || !Array.isArray(weeklySchedule)) {
//       return NextResponse.json(
//         { error: "labId and weeklySchedule[] are required" },
//         { status: 400 }
//       );
//     }

//     // Insert schedule
//     const { data: schedule, error: scheduleError } = await supabase
//       .from("schedules")
//       .insert({
//         labId,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       })
//       .select()
//       .single();

//     if (scheduleError) {
//       console.error("DB insert error (schedule):", scheduleError.message);
//       return NextResponse.json(
//         { error: scheduleError.message },
//         { status: 500 }
//       );
//     }

//     // Insert availabilities
//     const availabilitiesPayload = weeklySchedule.map((slot: any) => ({
//       scheduleId: schedule.id,
//       dayOfWeek: slot.dayOfWeek, // must match enum e.g. "MONDAY"
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//     }));

//     const { error: availError } = await supabase
//       .from("schedule_availabilities")
//       .insert(availabilitiesPayload);

//     if (availError) {
//       console.error("DB insert error (availabilities):", availError.message);
//       return NextResponse.json(
//         { error: availError.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { ...schedule, availabilities: availabilitiesPayload },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("Error creating schedule:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  const supabase = await createClient(cookies());

  try {
    const body = await req.json();
    const { labId, weeklySchedule } = body;

    if (!labId || !weeklySchedule || !Array.isArray(weeklySchedule)) {
      return NextResponse.json(
        { error: "labId and weeklySchedule[] are required" },
        { status: 400 }
      );
    }

    // 1. Check if schedule exists for this lab
    const { data: existingSchedule, error: findError } = await supabase
      .from("schedules")
      .select("*")
      .eq("labId", labId)
      .maybeSingle();

    if (findError) {
      console.error("DB find error:", findError.message);
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    let schedule;

    if (existingSchedule) {
      // 2. Update existing schedule (just updatedAt for now)
      const { data: updated, error: updateError } = await supabase
        .from("schedules")
        .update({ updatedAt: new Date().toISOString() })
        .eq("id", existingSchedule.id)
        .select()
        .single();

      if (updateError) {
        console.error("DB update error (schedule):", updateError.message);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      schedule = updated;

      // 3. Delete old availabilities so we can replace them
      const { error: deleteError } = await supabase
        .from("schedule_availabilities")
        .delete()
        .eq("scheduleId", existingSchedule.id);

      if (deleteError) {
        console.error("DB delete error (availabilities):", deleteError.message);
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }
    } else {
      // 4. Insert a brand new schedule
      const { data: inserted, error: insertError } = await supabase
        .from("schedules")
        .insert({
          labId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("DB insert error (schedule):", insertError.message);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      schedule = inserted;
    }

    // 5. Insert new availabilities
    const availabilitiesPayload = weeklySchedule.map((slot: any) => ({
      scheduleId: schedule.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    const { error: availError } = await supabase
      .from("schedule_availabilities")
      .insert(availabilitiesPayload);

    if (availError) {
      console.error("DB insert error (availabilities):", availError.message);
      return NextResponse.json({ error: availError.message }, { status: 500 });
    }

    return NextResponse.json(
      { ...schedule, availabilities: availabilitiesPayload },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating/updating schedule:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// Get schedule for a lab
export async function GET(req: Request) {
  const supabase = await createClient(cookies()); // 👈 FIXED
  const { searchParams } = new URL(req.url);
  const labId = searchParams.get("labId");

  if (!labId) {
    return NextResponse.json({ error: "labId is required" }, { status: 400 });
  }

  const { data: schedule, error } = await supabase
    .from("schedules")
    .select("*, availabilities:schedule_availabilities(*)")
    .eq("labId", labId)
    .maybeSingle();

  if (error) {
    console.error("DB fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!schedule) {
    return NextResponse.json({ error: "No schedule found" }, { status: 404 });
  }

  return NextResponse.json(schedule);
}
