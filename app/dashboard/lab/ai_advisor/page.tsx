// "use client";

// import React, { useContext, useEffect, useState } from "react";
// import { Activity, AlertTriangle, TrendingUp, MapPin, Users, Calendar, FileText, Lightbulb, AlertCircle, Zap } from "lucide-react";
// import { LabContext } from "@/app/context/LabContext";

// interface Outbreak {
//   State: string;
//   District: string;
//   Disease: string;
//   Cases: number;
//   Deaths: number;
//   Week: string;
//   Remarks: string;
// }

// function App() {

//   const labId = useContext(LabContext)?.labId;

//   const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("/api/outbreaks");
//         const data = await res.json();
//         if (data.error) throw new Error(data.error);

//         setOutbreaks(data.outbreaks || []);

//         if (data.suggestions && Array.isArray(data.suggestions.Suggestions)) {
//           setSuggestions(data.suggestions.Suggestions);
//         } else {
//           setSuggestions([]);
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   const activeOutbreaks = outbreaks.length;
//   const totalDeaths = outbreaks.reduce((sum, o) => sum + o.Deaths, 0);
//   const affectedDistricts = new Set(outbreaks.map(o => o.District)).size;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600 mb-4"></div>
//           <p className="text-slate-600 text-sm font-medium">Loading . . .</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
//           <div className="flex items-center mb-4">
//             <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
//             <h2 className="text-xl font-bold text-slate-800">Error Loading Data</h2>
//           </div>
//           <p className="text-slate-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

//       <div className="pl-8 pt-8 flex items-center space-x-2">
//         <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg p-1.5">
//           <Zap className="w-4 h-4 text-white" />
//         </div>
//         <h2 className="text-xl font-semibold">AI Outbreak Advisor</h2>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//           <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Active Outbreaks</p>
//                 <p className="text-2xl font-bold text-slate-900 mt-1">{activeOutbreaks}</p>
//               </div>
//               <div className="bg-blue-100 rounded-full p-2">
//                 <AlertTriangle className="w-5 h-5 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Deaths</p>
//                 <p className="text-2xl font-bold text-slate-900 mt-1">{totalDeaths.toLocaleString()}</p>
//               </div>
//               <div className="bg-red-100 rounded-full p-2">
//                 <AlertTriangle className="w-5 h-5 text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Affected Districts</p>
//                 <p className="text-2xl font-bold text-slate-900 mt-1">{affectedDistricts}</p>
//               </div>
//               <div className="bg-amber-100 rounded-full p-2">
//                 <MapPin className="w-5 h-5 text-amber-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {suggestions.length > 0 && (
//           <section className="mb-10">
//             <div className="flex items-center space-x-2 mb-4">
//               <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-1.5">
//                 <Lightbulb className="w-4 h-4 text-white" />
//               </div>
//               <h2 className="text-lg font-bold text-slate-900">AI-Powered Recommendations</h2>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               {suggestions.map((s, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] duration-200"
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="bg-white rounded-full p-1.5 shadow-sm flex-shrink-0">
//                       <TrendingUp className="w-4 h-4 text-amber-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-slate-800 text-sm font-medium leading-relaxed">{s}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         <section>
//           <div className="flex items-center space-x-2 mb-4">
//             <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-1.5">
//               <AlertTriangle className="w-4 h-4 text-white" />
//             </div>
//             <h2 className="text-lg font-bold text-slate-900">Active Outbreaks in Maharashtra</h2>
//           </div>
//           {outbreaks.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
//                 <Activity className="w-6 h-6 text-green-600" />
//               </div>
//               <p className="text-slate-600 text-base font-medium">No active outbreaks reported for the current week</p>
//               <p className="text-slate-400 text-xs mt-1">All clear in monitored regions</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {outbreaks.map((o, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-slate-200 hover:border-blue-300 group"
//                 >
//                   <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-white font-bold text-base flex items-center">
//                         <MapPin className="w-4 h-4 mr-1.5" />
//                         {o.District}
//                       </h3>
//                       <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
//                         <span className="text-white text-xs font-semibold">{o.Week}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 space-y-3">
//                     <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
//                       <p className="text-red-900 font-bold text-base">{o.Disease}</p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="bg-slate-50 rounded-lg p-2.5">
//                         <div className="flex items-center space-x-1.5 mb-1">
//                           <Users className="w-3.5 h-3.5 text-blue-600" />
//                           <p className="text-slate-500 text-xs font-medium uppercase">Cases</p>
//                         </div>
//                         <p className="text-xl font-bold text-slate-900">{o.Cases}</p>
//                       </div>

//                       <div className="bg-slate-50 rounded-lg p-2.5">
//                         <div className="flex items-center space-x-1.5 mb-1">
//                           <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
//                           <p className="text-slate-500 text-xs font-medium uppercase">Deaths</p>
//                         </div>
//                         <p className="text-xl font-bold text-slate-900">{o.Deaths}</p>
//                       </div>
//                     </div>

//                     {o.Remarks && o.Remarks !== "-" && (
//                       <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
//                         <div className="flex items-start space-x-2">
//                           <FileText className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
//                           <div>
//                             <p className="text-xs font-semibold text-amber-900 uppercase mb-0.5">Remarks</p>
//                             <p className="text-xs text-amber-800">{o.Remarks}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>

//     </div>
//   );
// }

// export default App;


"use client";

import React, { useEffect, useState, useContext } from "react";
import { Activity, AlertTriangle, TrendingUp, MapPin, Users, FileText, Lightbulb, AlertCircle, Zap } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LabContext } from "@/app/context/LabContext";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Outbreak {
  State: string;
  District: string;
  Disease: number;
  Cases: number;
  Deaths: number;
  Week: string;
  Remarks: string;
}

function AI_AD() {
  const labId = useContext(LabContext)?.labId;
  const supabase = createClientComponentClient();

  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("N/A");
  const [disabled, setDisabled] = useState(false);
  const [nextUpdate, setNextUpdate] = useState<string>("");

  //Real-time data fetch from DB
  useEffect(() => {
    if (!labId) return;

    const subscription = supabase
      .channel(`outbreak_reports_lab_${labId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'outbreak_reports', filter: `labId=eq.${labId}` },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('New report inserted:', payload.new);
          updateStateFromDB(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'outbreak_reports', filter: `labId=eq.${labId}` },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Report updated:', payload.new);
          updateStateFromDB(payload.new);
        }
      )
      .subscribe();

    // Initial fetch
    fetchFromDB();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [labId]);

  const updateStateFromDB = (data: any) => {
    const parsedOutbreaks = data.rawOutput ? JSON.parse(data.rawOutput) : [];
    const parsedSuggestions = data.suggestions ? JSON.parse(data.suggestions) : [];

    setOutbreaks(Array.isArray(parsedOutbreaks) ? parsedOutbreaks : []);
    setSuggestions(Array.isArray(parsedSuggestions) ? parsedSuggestions : []);
    setUpdatedAt(data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A");
  };

  // Fetch outbreak data from DB
  const fetchFromDB = async () => {
    if (!labId) return setError("Lab ID not found");
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("outbreak_reports")
        .select("rawOutput, suggestions, updatedAt")
        .eq("labId", labId)
        .maybeSingle();

      if (dbError) throw dbError;

      console.log("Fetched outbreak data from DB:", data);

      if (!data?.rawOutput) {
        setOutbreaks([]);
        setSuggestions([]);
        return;
      }

      const updatedAtDate = data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A";
      setUpdatedAt(updatedAtDate);

      const parsedOutbreaks = JSON.parse(data.rawOutput);

      const parsedSuggestions = JSON.parse(data.suggestions);

      console.log("Parsed suggestions data :", parsedSuggestions);

      if (Array.isArray(parsedOutbreaks)) setOutbreaks(parsedOutbreaks);
      else setOutbreaks([]);

      if (parsedSuggestions && Array.isArray(parsedSuggestions)) setSuggestions(parsedSuggestions);
      else setSuggestions([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch outbreak data");
    } finally {
      setLoading(false);
    }
  };

  // Refresh: call API to fetch latest PDF, update DB, and return new data
  const refreshData = async () => {
    if (!labId) return setError("Lab ID not found");
    setRefreshing(true);
    setError(null);

    try {
      const res = await fetch("/api/outbreaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update state with new data
      setOutbreaks(data.outbreaks || []);
      if (data.suggestions && Array.isArray(data.suggestions.Suggestions)) {
        setSuggestions(data.suggestions.Suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFromDB();
  }, [labId]);

  const activeOutbreaks = outbreaks.length;
  const totalDeaths = outbreaks.reduce((sum, o) => sum + o.Deaths, 0);
  const affectedDistricts = new Set(outbreaks.map(o => o.District)).size;

  //refresh button disable logic


  useEffect(() => {
    if ((!outbreaks || outbreaks.length === 0) && (!suggestions || suggestions.length === 0)) {
      setDisabled(false);
      setNextUpdate("");
      return;
    }

    const lastUpdated = new Date(updatedAt);
    const nextWeekDate = new Date(lastUpdated.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now >= nextWeekDate) {
      setDisabled(false);
      setNextUpdate("");
    } else {
      setDisabled(true);
      setNextUpdate(nextWeekDate.toLocaleDateString());
    }
  }, [updatedAt, outbreaks, suggestions]);


  //----------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-sm font-medium">Loading . . .</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-slate-800">Error Loading Data</h2>
          </div>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={fetchFromDB}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 ">

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg p-1.5">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">AI Outbreak Advisor</h2>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">Last Updated : {updatedAt}</p>

          {/* <button
          onClick={refreshData}
          disabled={refreshing}
          className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {refreshing ? "Refreshing . . ." : "Refresh"}
        </button> */}

          <button
            onClick={refreshData}
            disabled={refreshing || disabled}
            title={disabled && nextUpdate ? `Next update available on ${nextUpdate}` : ""}
            className="ml-auto disabled:cursor-not-allowed bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {refreshing ? "Refreshing . . ." : "Refresh"}
          </button>
        </div>

      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Active Outbreaks</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{activeOutbreaks}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Deaths</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalDeaths.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 rounded-full p-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Affected Districts</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{affectedDistricts}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-2">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-1.5">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">AI-Powered Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-white rounded-full p-1.5 shadow-sm flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm font-medium leading-relaxed">{s}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Outbreaks */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-1.5">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Active Outbreaks in Maharashtra</h2>
          </div>

          {outbreaks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-slate-600 text-base font-medium">No active outbreaks reported for the current week</p>
              <p className="text-slate-400 text-xs mt-1">Try refreshing the data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outbreaks.map((o, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-slate-200 hover:border-blue-300 group"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-base flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {o.District}
                      </h3>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <span className="text-white text-xs font-semibold">{o.Week}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
                      <p className="text-red-900 font-bold text-base">{o.Disease}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2.5">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-slate-500 text-xs font-medium uppercase">Cases</p>
                        </div>
                        <p className="text-xl font-bold text-slate-900">{o.Cases}</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <p className="text-slate-500 text-xs font-medium uppercase">Deaths</p>
                        </div>
                        <p className="text-xl font-bold text-slate-900">{o.Deaths}</p>
                      </div>
                    </div>

                    {o.Remarks && o.Remarks !== "-" && (
                      <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                        <div className="flex items-start space-x-2">
                          <FileText className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-900 uppercase mb-0.5">Remarks</p>
                            <p className="text-xs text-amber-800">{o.Remarks}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AI_AD;
