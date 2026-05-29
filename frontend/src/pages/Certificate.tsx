import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Download, Award, ShieldCheck } from 'lucide-react';

const Certificate = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/certificate/${user.id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="text-center py-20">Loading your certificate...</div>;
  if (!data) return <div className="text-center py-20 text-red-400">Unable to generate certificate. Please complete all 4 weeks.</div>;

  return (
    <div className="py-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Training Completion Certificate</h1>
        <p className="text-slate-400">Download or print your official summer training certificate.</p>
      </div>

      <div 
        ref={certRef}
        className="bg-white text-slate-900 p-12 rounded shadow-2xl w-full max-w-[800px] aspect-[1.414] relative border-[16px] border-double border-blue-900"
      >
        {/* Border patterns */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-slate-300 pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-between h-full relative z-10">
          <div className="text-center">
            <h2 className="text-blue-900 text-4xl font-serif font-bold uppercase tracking-widest mb-2">Certificate of Training</h2>
            <div className="h-1 w-48 bg-blue-900 mx-auto mb-8"></div>
            <p className="text-lg italic mb-6">This is to certify that</p>
            <h3 className="text-5xl font-bold text-slate-800 mb-2">{data.name}</h3>
            <p className="text-lg mb-8">S/o <span className="font-semibold">{data.fatherName}</span></p>
          </div>

          <div className="text-center max-w-xl">
            <p className="text-lg leading-relaxed">
              of <span className="font-bold">{data.collegeName}</span> ({data.branchName}) has successfully completed the 4-week 
              <span className="font-bold"> Summer Training Program </span> 
              in Electronic Systems and Software Development with an overall grade of 
              <span className="text-blue-700 font-bold"> "{data.grade}"</span>.
            </p>
          </div>

          <div className="w-full flex justify-between items-end mt-12 px-8">
            <div className="text-center border-t border-slate-400 pt-2 w-48">
              <p className="font-serif italic text-sm mb-1">{data.signatures.chiefAcademicOfficer}</p>
              <p className="text-xs font-bold uppercase text-slate-600">Chief Academic Officer</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full border-4 border-blue-900/20 flex items-center justify-center relative">
                <ShieldCheck size={48} className="text-blue-900/30" />
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <p className="text-[8px] font-bold text-center uppercase">Official<br/>Stamp</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: STR-{user.id}-2026</p>
            </div>

            <div className="text-center border-t border-slate-400 pt-2 w-48">
              <p className="font-serif italic text-sm mb-1">{data.signatures.technicalDirector}</p>
              <p className="text-xs font-bold uppercase text-slate-600">Technical Director</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 mt-4 italic">Issued on: {data.completionDate}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
        >
          <Download size={20} /> Download PDF / Print
        </button>
      </div>
    </div>
  );
};

export default Certificate;
