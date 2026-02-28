import React, { useState, useEffect } from 'react';
import { db } from '../src/lib/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Share2, Users, Trophy, Target, LogOut, CheckCircle, Copy } from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    phone: string;
    timestamp: number;
}

export const BienestarLogin: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [referrals, setReferrals] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorPhone, setErrorPhone] = useState('');
    const [copiedLine, setCopiedLine] = useState(false);

    // Auto-login si viene en la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlPhone = params.get('phone');
        if (urlPhone) {
            setPhone(urlPhone);
            handleLogin(urlPhone);
        }
    }, []);

    // Escuchar referidos en tiempo real
    useEffect(() => {
        if (!userData) return;

        const q = query(
            collection(db, "bienestar_users"),
            where("referredBy", "==", userData.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const refs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[];
            // Sort by timestamp descending
            refs.sort((a, b) => b.timestamp - a.timestamp);
            setReferrals(refs);
        });

        return () => unsubscribe();
    }, [userData]);

    const handleLogin = async (phoneToLogin: string) => {
        if (!phoneToLogin) return;
        setIsLoading(true);
        setErrorPhone('');

        try {
            const cleanPhone = phoneToLogin.replace(/\D/g, '');
            const q = query(collection(db, "bienestar_users"), where("phone", "==", cleanPhone));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                setUserData({ id: docSnap.id, ...docSnap.data() } as UserData);
                // Actualizar URL sin recargar
                window.history.replaceState(null, '', `/bienestarytecnologia/login?phone=${cleanPhone}`);
            } else {
                setErrorPhone('Número no encontrado. Verifica o regístrate en la página principal.');
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErrorPhone('Error al conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!userData) return;
        // Replace with actual domain when deployed, fallback to location.origin
        const url = `${window.location.origin}/bienestarytecnologia?ref=${userData.id}`;
        navigator.clipboard.writeText(url);
        setCopiedLine(true);
        setTimeout(() => setCopiedLine(false), 2000);
    };

    const handleLogout = () => {
        setUserData(null);
        setPhone('');
        setReferrals([]);
        window.history.replaceState(null, '', `/bienestarytecnologia/login`);
    };

    const referralCount = referrals.length;
    const goal = 10;
    const ultimateGoal = 15;
    const progressPercent = Math.min(100, Math.round((referralCount / goal) * 100));
    const isGoalMet = referralCount >= goal;
    const isUltimateGoalMet = referralCount >= ultimateGoal;

    if (!userData) {
        // LOGIN SCREEN
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black uppercase text-blue-600 mb-2">Ingresa a tu cuenta</h2>
                        <p className="text-neutral-500">Ingresa tu celular registrado para ver tu progreso y tus referidos.</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(phone); }} className="space-y-6">
                        <div>
                            <input
                                type="tel"
                                placeholder="Tu número de celular"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-4 text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium transition-all"
                            />
                            {errorPhone && <p className="text-red-500 text-sm mt-2">{errorPhone}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !phone}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black uppercase py-4 rounded-xl shadow-lg transition-all"
                        >
                            {isLoading ? "Consultando..." : "Ingresar"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-neutral-400">
                        ¿No tienes cuenta? <a href="/bienestarytecnologia" className="text-blue-600 font-bold hover:underline">Regístrate aquí</a>
                    </p>
                </div>
            </div>
        );
    }

    // DASHBOARD SCREEN
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-24">
            {/* HEADER NAVBAR */}
            <div className="bg-white border-b border-neutral-200 sticky top-0 z-30">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="font-black text-xl text-blue-600 uppercase tracking-tighter">Panel Bienestar</div>
                    <button onClick={handleLogout} className="text-neutral-500 hover:text-red-500 flex items-center gap-1 text-sm font-bold uppercase transition-colors">
                        Salir <LogOut size={16} />
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

                {/* SALUDO Y LINK */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200 text-center space-y-4">
                    <h1 className="text-2xl font-bold">¡Hola, {userData.name}!</h1>
                    <p className="text-neutral-500 max-w-lg mx-auto">Este es tu enlace único. Compártelo con amigos y familiares. Por cada persona que se una a través de tu enlace, sumarás un referido.</p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
                        <div className="bg-neutral-100 text-neutral-700 font-medium py-3 px-4 rounded-xl w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap border border-neutral-200">
                            {`${window.location.origin}/bienestarytecnologia?ref=${userData.id}`}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all w-full md:w-auto justify-center ${copiedLine ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {copiedLine ? <><CheckCircle size={18} /> Copiado</> : <><Copy size={18} /> Copiar Link</>}
                        </button>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100">
                        <a
                            href="https://chat.whatsapp.com/B5TgUFxg1MxEx4ehuy6qWB?mode=gi_t"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-lg uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            ÚNETE A NUESTRO GRUPO PARA QUE PROMOVAMOS JUNTOS
                        </a>
                    </div>
                </div>

                {/* GAMIFICATION PROGRESS */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200 space-y-6 relative overflow-hidden">
                    {isUltimateGoalMet && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />}

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                                <Target className="text-blue-500" /> Meta Actual
                            </h3>
                            <p className="text-4xl font-black text-blue-600 mt-1">{referralCount} <span className="text-base font-medium text-neutral-400">/ {goal} Directos</span></p>
                        </div>
                        {isGoalMet && !isUltimateGoalMet && (
                            <div className="text-right">
                                <p className="text-sm font-bold text-green-600 badge">¡Meta Alcanzada!</p>
                                <p className="text-xs text-neutral-500 mt-1">Siguiente: {ultimateGoal}</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden relative">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {!isGoalMet ? (
                        <p className="text-sm text-neutral-600 text-center font-medium">Te faltan {goal - referralCount} inscritos para completar la primera meta.</p>
                    ) : !isUltimateGoalMet ? (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-4 animate-in fade-in">
                            <Trophy className="text-blue-500 shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-blue-900">¡Impresionante!</p>
                                <p className="text-sm text-blue-700 mt-1">Has llegado a los 10 referidos. <br className="md:hidden" />Llega a {ultimateGoal} para desbloquear el <strong>Kit de bienestar integral</strong>.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 flex flex-col md:flex-row items-center gap-6 text-center md:text-left animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-full flex items-center justify-center shadow-lg shrink-0">
                                <Trophy className="text-yellow-700 w-8 h-8" fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-yellow-900 uppercase">¡Kit de Bienestar Desbloqueado!</h4>
                                <p className="text-yellow-800 mt-2 font-medium">Has superado los {ultimateGoal} referidos. Nos contactaremos pronto contigo para gestionar tu premio.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* LISTA DE REFERIDOS */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-neutral-400" />
                        <h3 className="text-lg font-bold text-neutral-800">Tus Referidos ({referrals.length})</h3>
                    </div>

                    {referrals.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400 space-y-3">
                            <Share2 size={32} className="mx-auto opacity-20" />
                            <p>Aún no tienes referidos.</p>
                            <p className="text-sm">Comparte tu link para empezar a sumar.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {referrals.map((ref, idx) => (
                                <div key={ref.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                                            {ref.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">{ref.name}</p>
                                            <p className="text-xs text-neutral-500">{new Date(ref.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-green-500 font-bold text-sm flex items-center gap-1">
                                        <CheckCircle size={14} /> Activo
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
