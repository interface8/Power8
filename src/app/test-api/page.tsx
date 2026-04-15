// "use client";

// import { useEffect, useState } from "react";

// export default function TestApiPage() {
//   const [results, setResults] = useState<any>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const testEndpoints = [
//     { name: "User Systems", url: "/api/systems" },
//     { name: "Dashboard Overview", url: "/api/dashboard" },
//     { name: "Payment Summary", url: "/api/dashboard/payments" },
//     { name: "Savings", url: "/api/dashboard/savings" },
//   ];

//   const fetchAll = async () => {
//     setLoading(true);
//     setError(null);
//     const newResults: any = {};

//     for (const endpoint of testEndpoints) {
//       try {
//         console.log(`Fetching: ${endpoint.name} → ${endpoint.url}`);

//         const res = await fetch(endpoint.url, {
//           credentials: "include",   // Important for authentication
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         console.log(`${endpoint.name} Status:`, res.status);

//         const text = await res.text(); // First get raw text

//         console.log(`${endpoint.name} Raw Response (first 400 chars):`);
//         console.log(text.substring(0, 400));

//         let jsonData;
//         try {
//           jsonData = JSON.parse(text);
//         } catch {
//           jsonData = { rawHtml: text.substring(0, 500) + "..." };
//         }

//         newResults[endpoint.name] = {
//           status: res.status,
//           ok: res.ok,
//           data: jsonData,
//           isHtml: text.trim().startsWith("<!DOCTYPE"),
//         };
//       } catch (err: any) {
//         console.error(`Error fetching ${endpoint.name}:`, err);
//         newResults[endpoint.name] = {
//           status: "Network Error",
//           error: err.message,
//         };
//       }
//     }

//     setResults(newResults);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <p className="text-lg">Testing APIs... Please wait</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">API Test Results</h1>
//         <button
//           onClick={fetchAll}
//           className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Refresh All
//         </button>
//       </div>

//       {error && <p className="text-red-600 mb-6">{error}</p>}

//       <div className="space-y-10">
//         {Object.entries(results).map(([name, result]: [string, any]) => (
//           <div key={name} className="border rounded-xl p-6 bg-gray-50">
//             <h2 className="text-2xl font-semibold mb-4 text-green-700">
//               {name}
//             </h2>
            
//             <div className="grid grid-cols-2 gap-4 text-sm mb-4">
//               <p><strong>Status:</strong> {result.status}</p>
//               <p><strong>OK:</strong> {result.ok ? "✅ Yes" : "❌ No"}</p>
//             </div>

//             {result.isHtml && (
//               <p className="text-red-600 font-medium mb-3">
//                 ⚠️ Received HTML instead of JSON (likely 401, 404 or redirect)
//               </p>
//             )}

//             <pre className="bg-gray-900 text-green-300 p-5 rounded-xl overflow-auto text-xs max-h-96">
//               {JSON.stringify(result.data, null, 2)}
//             </pre>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12 text-center text-sm text-gray-500">
//         Check the browser console for more detailed logs
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// export default function TestApiPage() {
//   const [results, setResults] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(true);

//   const endpoints = [
//     { name: "User Systems", url: "/api/systems" },
//     { name: "Dashboard Overview", url: "/api/dashboard" },
//     { name: "Payment Summary", url: "/api/dashboard/payments" },
//     { name: "Savings", url: "/api/dashboard/savings" },
//     { name: "Credit by Order (example)", url: "/api/credit/01" }, // Replace with real orderId if known
//     { name: "Credit Schedule", url: "/api/credit/schedule/01" }, // Replace if known
//   ];

//   const fetchAll = async () => {
//     setLoading(true);
//     const newResults: Record<string, any> = {};

//     for (const ep of endpoints) {
//       try {
//         const res = await fetch(ep.url, { 
//           credentials: "include",
//           headers: { "Content-Type": "application/json" }
//         });

//         const text = await res.text();
//         let jsonData;
//         try {
//           jsonData = JSON.parse(text);
//         } catch {
//           jsonData = { raw: text.substring(0, 300) + "..." };
//         }

//         newResults[ep.name] = {
//           status: res.status,
//           ok: res.ok,
//           data: jsonData,
//           isHtml: text.trim().startsWith("<!DOCTYPE"),
//         };
//       } catch (err: any) {
//         newResults[ep.name] = { status: "Error", error: err.message };
//       }
//     }

//     setResults(newResults);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   if (loading) return <div className="p-10 text-center">Testing Payment & Credit APIs...</div>;

//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-10">
//       <h1 className="text-3xl font-bold">Payment & Credit API Test</h1>

//       {Object.entries(results).map(([name, result]) => (
//         <div key={name} className="border rounded-2xl p-6 bg-white">
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">{name}</h2>
//             <span className={`font-medium ${result.ok ? "text-green-600" : "text-red-600"}`}>
//               Status: {result.status}
//             </span>
//           </div>

//           {result.isHtml && (
//             <p className="text-red-600 mb-3">⚠️ Received HTML (likely auth or 404 issue)</p>
//           )}

//           <pre className="bg-gray-900 text-green-400 p-5 rounded-xl overflow-auto text-sm">
//             {JSON.stringify(result.data, null, 2)}
//           </pre>
//         </div>
//       ))}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// export default function TestPaymentsPage() {
//   const [results, setResults] = useState<any>({});
//   const [loading, setLoading] = useState(true);
//   const [orderId, setOrderId] = useState<string>(""); // You can enter an orderId here

//   const testEndpoints = [
//     { 
//       name: "Initiate Payment (POST)", 
//       url: "/api/payments/initiate", 
//       method: "POST",
//       body: { orderId: orderId || "SAMPLE_ORDER_ID" }
//     },
//     { 
//       name: "Get Payments by OrderId (GET)", 
//       url: `/api/payments/${orderId || "SAMPLE_ORDER_ID"}`, 
//       method: "GET" 
//     },
//   ];

//   const runTests = async () => {
//     setLoading(true);
//     const newResults: any = {};

//     for (const ep of testEndpoints) {
//       try {
//         let res;
//         if (ep.method === "POST") {
//           res = await fetch(ep.url, {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(ep.body),
//           });
//         } else {
//           res = await fetch(ep.url, { 
//             credentials: "include" 
//           });
//         }

//         const text = await res.text();
//         let jsonData;
//         try {
//           jsonData = JSON.parse(text);
//         } catch {
//           jsonData = { rawResponse: text.substring(0, 400) };
//         }

//         newResults[ep.name] = {
//           status: res.status,
//           ok: res.ok,
//           data: jsonData,
//           isHtml: text.trim().startsWith("<!DOCTYPE"),
//         };
//       } catch (err: any) {
//         newResults[ep.name] = {
//           status: "Fetch Error",
//           error: err.message,
//         };
//       }
//     }

//     setResults(newResults);
//     setLoading(false);
//   };

//   useEffect(() => {
//     runTests();
//   }, []);

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Payments API Test</h1>

//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">Test with Order ID (optional)</label>
//         <input
//           type="text"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           placeholder="Enter Order ID"
//           className="border rounded-lg px-4 py-2 w-full max-w-md"
//         />
//         <button
//           onClick={runTests}
//           className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Run Tests Again
//         </button>
//       </div>

//       {loading && <p className="text-lg">Testing Payment APIs...</p>}

//       <div className="space-y-8">
//         {Object.entries(results).map(([name, result]: [string, any]) => (
//           <div key={name} className="border rounded-2xl p-6 bg-white">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">{name}</h2>
//               <span className={`font-medium ${result.ok ? "text-green-600" : "text-red-600"}`}>
//                 Status: {result.status}
//               </span>
//             </div>

//             {result.isHtml && (
//               <p className="text-red-600 mb-3">⚠️ Received HTML instead of JSON</p>
//             )}

//             <pre className="bg-gray-900 text-green-400 p-5 rounded-xl overflow-auto text-sm">
//               {JSON.stringify(result.data, null, 2)}
//             </pre>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }