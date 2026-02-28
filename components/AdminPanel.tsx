import React, { useState, useEffect } from 'react';
import { FunnelStep, UserSession, Lead } from '../types';
import { db } from '../src/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, getCountFromServer } from 'firebase/firestore';
import {
  Users,
  Activity,
  ArrowLeft,
  Clock,
  ChevronRight,
  Trash2,
  Smartphone,
  ClipboardList,
  Calendar,
  Phone,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Props {
  onExit: () => void;
}

export const AdminPanel: React.FC<Props> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bienestarUsers, setBienestarUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'leads' | 'bienestar'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalBienestar, setTotalBienestar] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    setIsRefreshing(true);

    // Subscribe to Sessions
    const sessionsQuery = query(collection(db, "sessions"), orderBy("lastActive", "desc"), limit(100));
    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const loadedSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserSession[];
      setSessions(loadedSessions);
      setIsRefreshing(false);
    });

    // Subscribe to Leads
    const leadsQuery = query(collection(db, "leads"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const loadedLeads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      setLeads(loadedLeads);
    });

    // Subscribe to Bienestar Users
    const bienestarQuery = query(collection(db, "bienestar_users"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribeBienestar = onSnapshot(bienestarQuery, (snapshot) => {
      const loadedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBienestarUsers(loadedUsers);
    });

    // Fetch Total Counts (Realtime count not supported natively without heavy costs/functions, so we fetch once or on refresh)
    const fetchTotals = async () => {
      try {
        const sSnapshot = await getCountFromServer(collection(db, "sessions"));
        setTotalSessions(sSnapshot.data().count);

        const lSnapshot = await getCountFromServer(collection(db, "leads"));
        setTotalLeads(lSnapshot.data().count);

        const bSnapshot = await getCountFromServer(collection(db, "bienestar_users"));
        setTotalBienestar(bSnapshot.data().count);
      } catch (e) {
        console.error("Error fetching totals:", e);
      }
    };

    fetchTotals();

    return () => {
      unsubscribeSessions();
      unsubscribeLeads();
      unsubscribeBienestar();
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vladimir2026') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-white">Acceso Restringido</h1>
            <p className="text-neutral-500 text-sm">Panel de Control Vladimir</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de acceso"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-center focus:border-red-600 outline-none transition-colors"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-bold">Contraseña incorrecta</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Salir
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Función para refrescar datos y totales
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const sSnapshot = await getCountFromServer(collection(db, "sessions"));
      setTotalSessions(sSnapshot.data().count);

      const lSnapshot = await getCountFromServer(collection(db, "leads"));
      setTotalLeads(lSnapshot.data().count);

      const bSnapshot = await getCountFromServer(collection(db, "bienestar_users"));
      setTotalBienestar(bSnapshot.data().count);
    } catch (e) {
      console.error("Error refreshing totals:", e);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const clearData = () => {
    alert("El borrado masivo está deshabilitado en la base de datos por seguridad.");
  };

  const calculateConversion = (step: FunnelStep) => {
    if (sessions.length === 0) return 0;
    const count = sessions.filter(s => s.stepsReached && s.stepsReached.includes(step)).length;
    return Math.round((count / sessions.length) * 100);
  };

  const funnelSteps = Object.values(FunnelStep).filter(s => s !== FunnelStep.ADMIN);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050505] text-neutral-100 overflow-y-auto font-sans selection:bg-blue-500">
      {/* HEADER DINÁMICO */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-neutral-800 px-4 md:px-8 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-neutral-800 rounded-xl transition-all active:scale-90 text-neutral-400 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none">
              Vladimir <span className="text-red-600">Control</span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Panel de Ejecución (En Vivo)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg text-neutral-400 hover:text-white transition-all ${isRefreshing ? 'animate-spin text-blue-500' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
          <div className="hidden md:flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Métricas
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'sessions' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Tráfico
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'leads' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Inscritos ({totalLeads})
            </button>
            <button
              onClick={() => setActiveTab('bienestar')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'bienestar' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Bienestar ({totalBienestar})
            </button>
          </div>
          <button onClick={clearData} className="p-2 text-neutral-700 hover:text-red-500 transition-colors ml-2" title="Resetear todo">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* NAVEGACIÓN MÓVIL (TABS INFERIORES) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-2xl flex shadow-2xl overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('overview')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[9px] font-black uppercase ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}>Métricas</button>
        <button onClick={() => setActiveTab('sessions')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[9px] font-black uppercase ${activeTab === 'sessions' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}>Tráfico</button>
        <button onClick={() => setActiveTab('leads')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[9px] font-black uppercase ${activeTab === 'leads' ? 'bg-red-600 text-white' : 'text-neutral-500'}`}>Leads ({totalLeads})</button>
        <button onClick={() => setActiveTab('bienestar')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[9px] font-black uppercase ${activeTab === 'bienestar' ? 'bg-green-600 text-white' : 'text-neutral-500'}`}>Bienestar ({totalBienestar})</button>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-32">

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl space-y-1">
                <Users size={20} className="text-neutral-500 mb-2" />
                <div className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Total Tráfico</div>
                <div className="text-4xl font-black">{totalSessions}</div>
              </div>

              <button
                onClick={() => setActiveTab('leads')}
                className="group bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl space-y-1 text-left hover:border-red-600/50 transition-all active:scale-95"
              >
                <ClipboardList size={20} className="text-red-500 mb-2" />
                <div className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Inscritos Finales</div>
                <div className="text-4xl font-black text-red-600 flex items-center gap-2">
                  {totalLeads}
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform opacity-30" />
                </div>
              </button>

              <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl space-y-1">
                <Activity size={20} className="text-blue-500 mb-2" />
                <div className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Conv. Ventas</div>
                <div className="text-4xl font-black">{calculateConversion(FunnelStep.SALES_PAGE)}%</div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl space-y-1">
                <ExternalLink size={20} className="text-green-500 mb-2" />
                <div className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Conv. Leads</div>
                <div className="text-4xl font-black text-green-500">
                  {totalSessions > 0 ? Math.round((totalLeads / totalSessions) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Funnel Flow */}
            <div className="bg-neutral-900/30 border border-neutral-800 p-8 rounded-[2.5rem] space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Embudo de Ejecución</h3>
                <span className="text-[10px] bg-green-600/10 text-green-500 px-3 py-1 rounded-full font-bold">Base de Datos Conectada</span>
              </div>

              <div className="space-y-6">
                {funnelSteps.map((stepName, i) => {
                  const perc = calculateConversion(stepName as FunnelStep);
                  return (
                    <div key={stepName} className="group">
                      <div className="flex justify-between items-end mb-2 px-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-neutral-700 w-4">0{i + 1}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{stepName}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-white">{perc}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out"
                          style={{ width: `${perc}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/80">
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Sesión ID</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Paso Actual</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Progreso</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="font-mono text-xs text-blue-500 group-hover:text-blue-400">#{session.id}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${session.currentStep === FunnelStep.SALES_PAGE ? 'bg-green-500/10 text-green-500' : 'bg-neutral-800 text-neutral-400'
                            }`}>
                            {session.currentStep}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-1">
                            {funnelSteps.map((s, i) => (
                              <div
                                key={i}
                                className={`h-1 w-3 rounded-full transition-all ${session.stepsReached && session.stepsReached.includes(s as FunnelStep) ? 'bg-blue-500 scale-y-125' : 'bg-neutral-700'}`}
                                title={s}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[11px] text-neutral-500 font-medium">
                          {new Date(session.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                    {sessions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-neutral-600 italic font-medium uppercase tracking-widest text-[10px]">No hay sesiones activas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tighter">Personas Inscritas</h2>
              <div className="text-[10px] font-bold uppercase text-neutral-500 border border-neutral-800 px-3 py-1 rounded-full">
                {totalLeads} Resultados
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/80">
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Nombre del Ciudadano</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Contacto Directo</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Fecha y Hora</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 text-white flex items-center justify-center font-black text-sm italic shadow-lg group-hover:scale-110 transition-transform">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm text-white group-hover:translate-x-1 transition-transform">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                            <Phone size={12} className="text-blue-500" />
                            {lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-white text-[11px] font-bold">
                              <Calendar size={12} className="text-neutral-500" />
                              {new Date(lead.timestamp).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-[10px] ml-5">
                              {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(lead.name.split(' ')[0])},%20vimos%20tu%20registro%20en%20el%20Plan%20de%20Ejecuci%C3%B3n%20de%20Vladimir.%20Bienvenido.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase bg-green-600/10 text-green-500 px-4 py-2.5 rounded-xl border border-green-500/20 hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-green-900/10"
                          >
                            Chat Privado <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-32 text-center">
                          <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-700">
                              <ClipboardList size={32} />
                            </div>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                              Base de datos vacía.<br />Los nuevos inscritos aparecerán aquí automáticamente.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bienestar' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tighter">Bienestar y Tecnología</h2>
              <div className="text-[10px] font-bold uppercase text-neutral-500 border border-neutral-800 px-3 py-1 rounded-full">
                {totalBienestar} Registrados
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/80">
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Nombre Completo</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Celular</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Referido Por</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest">Fecha y Hora</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-neutral-500 tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {bienestarUsers.map((user) => {
                      const referrer = user.referredBy ? bienestarUsers.find(u => u.id === user.referredBy) : null;
                      return (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-900 text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform uppercase">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-bold text-sm text-white group-hover:translate-x-1 transition-transform">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                              <Phone size={12} className="text-green-500" />
                              {user.phone}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {referrer ? (
                              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">
                                {referrer.name}
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest">
                                Orgánico
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-white text-[11px] font-bold">
                                <Calendar size={12} className="text-neutral-500" />
                                {new Date(user.timestamp).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-neutral-500 text-[10px] ml-5">
                                {new Date(user.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <a
                              href={`https://wa.me/${user.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(user.name.split(' ')[0])},%20Te%20hablamos%20de%20parte%20de%20la%20campa%C3%B1a%20por%20un%20Upgrade%20al%20sistema%20de%20Salud.`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase bg-green-600/10 text-green-500 px-4 py-2.5 rounded-xl border border-green-500/20 hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-green-900/10"
                            >
                              Chat Privado <ExternalLink size={12} />
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                    {bienestarUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-32 text-center">
                          <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-700">
                              <ClipboardList size={32} />
                            </div>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                              Base de datos vacía.<br />Los nuevos inscritos en Bienestar aparecerán aquí automáticamente.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
