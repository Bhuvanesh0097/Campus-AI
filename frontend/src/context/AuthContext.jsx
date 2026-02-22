import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../services/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const configured = isConfigured();

    useEffect(() => {
        if (!configured || !supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [configured]);

    const signUp = async (email, password, fullName) => {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        if (!supabase) return { error: null };
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const value = {
        user,
        session,
        loading,
        configured,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
