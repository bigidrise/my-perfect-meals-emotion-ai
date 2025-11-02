import React from 'react';
export default function BarcodeScanButton({ onScan }: { onScan: (upc: string)=>void }){
  return (
    <button className="px-3 py-2 border rounded-xl"
      onClick={()=>alert('📷 Barcode scanner coming soon!')}>
      📷 Scan
    </button>
  );
}