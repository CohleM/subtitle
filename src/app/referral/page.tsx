'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useLocalStorage from 'use-local-storage';
import {
    Copy, Check, MousePointer, Users, CreditCard, DollarSign,
    ChevronRight, AlertCircle, ExternalLink, Twitter, Facebook,
    Home, Link2, Wallet, ImageIcon,
    CheckCircle2, Clock, XCircle, Edit2, Save, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferrerData {
    id: number;
    code: string;
    clicks: number;
    signups: number;
    customers: number;
    total_earned_cents: number;
    first_name: string | null;
    last_name: string | null;
    address: string | null;
    paypal_email: string | null;
    created_at: string;
}

interface ReferralUser {
    id: number;
    masked_email: string;
    converted: boolean;
    created_at: string;
}

interface Payout {
    id: number;
    amount_cents: number;
    status: 'pending' | 'paid' | 'failed';
    created_at: string;
    paid_at: string | null;
    note: string | null;
}

type Tab = 'home' | 'referrals' | 'payouts' | 'assets';

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const visible = local.slice(0, Math.max(2, local.length - 5));
    return `${visible}${'*'.repeat(Math.min(5, local.length - visible.length))}@${domain}`;
}

function fmt$(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
}

function relTime(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
                {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Copy">
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
        </button>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReferralPortal() {
    const router = useRouter();
    const [accessToken] = useLocalStorage('access_token', '');

    const [tab, setTab] = useState<Tab>('home');
    const [referrer, setReferrer] = useState<ReferrerData | null>(null);
    const [loading, setLoading] = useState(true);

    // Create form
    const [newCode, setNewCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Referrals tab
    const [referralUsers, setReferralUsers] = useState<ReferralUser[]>([]);
    const [loadingReferrals, setLoadingReferrals] = useState(false);

    // Payouts tab
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loadingPayouts, setLoadingPayouts] = useState(false);

    // Profile edit
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        first_name: '', last_name: '', address: '', paypal_email: ''
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    const headers = useCallback(() => ({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }), [accessToken]);

    // ── Fetch referrer on mount ──
    const fetchReferrer = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/referral/me`, { headers: headers() });
            if (res.ok) {
                const data = await res.json();
                setReferrer(data);

                console.log('referral data', data)
                setProfileForm({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    address: data.address || '',
                    paypal_email: data.paypal_email || '',
                });
            } else if (res.status === 404) {
                // User doesn't have a referral account yet
                setReferrer(null);
            }
        } catch (e) {
            console.error('Failed to fetch referrer:', e);
        }
        setLoading(false);
    }, [accessToken, headers]);

    useEffect(() => {
        fetchReferrer();
    }, [fetchReferrer]);

    // ── Fetch referral users ──
    useEffect(() => {
        if (tab !== 'referrals' || !referrer || !accessToken) return;
        setLoadingReferrals(true);
        fetch(`${API}/referral/users`, { headers: headers() })
            .then(r => r.ok ? r.json() : [])
            .then(setReferralUsers)
            .catch(() => setReferralUsers([]))
            .finally(() => setLoadingReferrals(false));
    }, [tab, referrer, accessToken, headers]);

    // ── Fetch payouts ──
    useEffect(() => {
        if (tab !== 'payouts' || !referrer || !accessToken) return;
        setLoadingPayouts(true);
        fetch(`${API}/referral/payouts`, { headers: headers() })
            .then(r => r.ok ? r.json() : [])
            .then(setPayouts)
            .catch(() => setPayouts([]))
            .finally(() => setLoadingPayouts(false));
    }, [tab, referrer, accessToken, headers]);

    // ── Create referrer ──
    const handleCreate = async () => {
        setCreateError('');
        const code = newCode.toLowerCase().trim();
        if (!/^[a-z0-9_]{3,20}$/.test(code)) {
            setCreateError('3–20 chars, letters/numbers/underscores only');
            return;
        }
        setCreating(true);
        try {
            const res = await fetch(`${API}/referral/create`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (res.ok) {
                setReferrer(data);
            }
            else {
                setCreateError(data.detail || 'Something went wrong');
            }
        } catch {
            setCreateError('Network error');
        }
        setCreating(false);
    };

    // ── Save profile ──
    const handleSaveProfile = async () => {
        setSavingProfile(true);
        setProfileMsg('');
        try {
            const res = await fetch(`${API}/referral/profile`, {
                method: 'PATCH',
                headers: headers(),
                body: JSON.stringify(profileForm),
            });
            if (res.ok) {
                const data = await res.json();
                setReferrer(data);
                setEditingProfile(false);
                setProfileMsg('Saved!');
            } else {
                setProfileMsg('Failed to save');
            }
        } catch {
            setProfileMsg('Network error');
        }
        setSavingProfile(false);
    };

    const referralLink = referrer ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?via=${referrer.code}` : '';
    const hasPaymentInfo = referrer?.paypal_email && referrer?.first_name;

    return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">

            {/* Top navbar with logo + tabs */}
            <header className="bg-white border-b border-gray-200 px-6 flex items-center gap-6 h-14 shrink-0">
                {/* Logo */}
                <Link href="/dashboard" className="shrink-0">
                    <Image src="/logo.png" alt="PrimeClip Logo" width={100} height={32} priority />
                </Link>

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200" />

                {/* Tabs */}
                <nav className="flex items-center gap-1">
                    {([
                        { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
                        { id: 'referrals', label: 'Referrals', icon: <Users className="w-3.5 h-3.5" /> },
                        { id: 'payouts', label: 'Payouts', icon: <Wallet className="w-3.5 h-3.5" /> },
                        { id: 'assets', label: 'Assets', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                    ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            disabled={!referrer && t.id !== 'home'}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${tab === t.id
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </nav>

                {/* Spacer + back to dashboard */}
                <div className="ml-auto">
                    <Link href="/dashboard">
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            ← Dashboard
                        </button>
                    </Link>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/30">
                <div className="max-w-3xl mx-auto p-8 space-y-6">

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                        </div>
                    ) : !referrer ? (
                        <OnboardingSection
                            newCode={newCode}
                            setNewCode={setNewCode}
                            handleCreate={handleCreate}
                            creating={creating}
                            createError={createError}
                        />
                    ) : (
                        <>
                            {tab === 'home' && (
                                <HomeTab
                                    referrer={referrer}
                                    referralLink={referralLink}
                                    hasPaymentInfo={!!hasPaymentInfo}
                                    editingProfile={editingProfile}
                                    setEditingProfile={setEditingProfile}
                                    profileForm={profileForm}
                                    setProfileForm={setProfileForm}
                                    savingProfile={savingProfile}
                                    handleSaveProfile={handleSaveProfile}
                                    profileMsg={profileMsg}
                                    onCodeChanged={(updated: ReferrerData) => setReferrer(updated)}
                                />
                            )}
                            {tab === 'referrals' && (
                                <ReferralsTab referralUsers={referralUsers} loading={loadingReferrals} />
                            )}
                            {tab === 'payouts' && (
                                <PayoutsTab
                                    payouts={payouts}
                                    loading={loadingPayouts}
                                    totalEarned={referrer.total_earned_cents}
                                    hasPaymentInfo={!!hasPaymentInfo}
                                    onGoToProfile={() => { setTab('home'); setEditingProfile(true); }}
                                />
                            )}
                            {tab === 'assets' && <AssetsTab />}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function OnboardingSection({ newCode, setNewCode, handleCreate, creating, createError }: any) {
    return (
        <div className="max-w-md mx-auto pt-12 text-center space-y-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <Link2 className="w-7 h-7 text-gray-700" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Join the Affiliate Program</h1>
                <p className="text-sm text-gray-500">Earn <span className="font-semibold text-gray-700">30% commission</span> on every paying customer you refer. Choose your unique referral code below.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-left space-y-4">
                <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">Your referral code</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-900">
                        <span className="bg-gray-50 border-r border-gray-200 px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                            primeclip.pro/?via=
                        </span>
                        <input
                            value={newCode}
                            onChange={e => setNewCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="yourname"
                            className="flex-1 px-3 py-2.5 text-sm outline-none bg-white min-w-0"
                        />
                    </div>
                    {createError && <p className="text-xs text-red-500 mt-1.5">{createError}</p>}
                </div>

                <button
                    onClick={handleCreate}
                    disabled={creating || newCode.length < 3}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-700 transition-colors"
                >
                    {creating ? 'Creating...' : 'Create my referral link →'}
                </button>

                <p className="text-[10px] text-gray-400 text-center">This code cannot be changed later.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                {[
                    { label: 'Commission', value: '30%' },
                    { label: 'Cookie life', value: '30 days' },
                    { label: 'Payout', value: 'Monthly' },
                ].map(i => (
                    <div key={i.label} className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-base font-bold text-gray-900">{i.value}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{i.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────

function HomeTab({ referrer, referralLink, hasPaymentInfo, editingProfile, setEditingProfile, profileForm, setProfileForm, savingProfile, handleSaveProfile, profileMsg, onCodeChanged }: any) {
    const tweetText = encodeURIComponent(`I use PrimeClip to create stunning subtitle videos in minutes. Try it free → ${referralLink}`);
    const fbShare = encodeURIComponent(referralLink);

    const [editingCode, setEditingCode] = useState(false);
    const [newCodeInput, setNewCodeInput] = useState('');
    const [savingCode, setSavingCode] = useState(false);
    const [codeError, setCodeError] = useState('');
    const [accessToken] = useLocalStorage('access_token', '');

    const handleCodeChange = async () => {
        setCodeError('');
        if (!/^[a-z0-9_]{3,20}$/.test(newCodeInput)) {
            setCodeError('3–20 chars, letters/numbers/underscores only');
            return;
        }
        setSavingCode(true);
        try {
            const res = await fetch(`${API}/referral/create`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newCodeInput }),
            });
            const data = await res.json();
            if (res.ok) {
                setEditingCode(false);
                setNewCodeInput('');
                onCodeChanged(data);
            } else {
                setCodeError(data.detail || 'Something went wrong');
            }
        } catch {
            setCodeError('Network error');
        }
        setSavingCode(false);
    };

    return (
        <div className="space-y-5">

            {/* Payment method warning */}
            {!hasPaymentInfo && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-800">You haven't added a payout method yet. Add one to receive payments.</p>
                    </div>
                    <button
                        onClick={() => setEditingProfile(true)}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap ml-4"
                    >
                        Add payout method →
                    </button>
                </div>
            )}

            {/* Stats row - SubMagic style */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm font-semibold text-gray-900">PrimeClip Affiliates</span>
                    <span className="text-base">🚀</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { icon: <MousePointer className="w-5 h-5 text-orange-500" />, label: 'clicks', value: referrer.clicks },
                        { icon: <Users className="w-5 h-5 text-orange-500" />, label: 'referrals', value: referrer.signups },
                        { icon: <CreditCard className="w-5 h-5 text-orange-500" />, label: 'customers', value: referrer.customers },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">{s.icon}</div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Earnings - Large display */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Total earned</p>
                    <p className="text-4xl font-bold text-gray-900">{fmt$(referrer.total_earned_cents)}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[11px] text-gray-400">Premium sale → <span className="font-semibold text-gray-700">$5.70</span></p>
                    <p className="text-[11px] text-gray-400">Ultra sale → <span className="font-semibold text-gray-700">$11.70</span></p>
                    <p className="text-[11px] text-gray-400 mt-2">30% recurring commission</p>
                </div>
            </div>

            {/* Change code modal */}
            {editingCode && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Change referral code</h3>
                            <button onClick={() => { setEditingCode(false); setNewCodeInput(''); setCodeError(''); }}
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">New code</label>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-900 mt-1">
                                <span className="bg-gray-50 border-r border-gray-200 px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                                    ?via=
                                </span>
                                <input
                                    value={newCodeInput}
                                    onChange={e => setNewCodeInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                                    placeholder={referrer.code}
                                    autoFocus
                                />
                            </div>
                            {codeError && <p className="text-xs text-red-500 mt-1.5">{codeError}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCodeChange}
                                disabled={savingCode || newCodeInput.length < 3}
                                className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-700 transition-colors"
                            >
                                {savingCode ? 'Saving...' : 'Submit'}
                            </button>
                            <button
                                onClick={() => { setEditingCode(false); setNewCodeInput(''); setCodeError(''); }}
                                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Referral link */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Referral link</p>
                    <button
                        onClick={() => setEditingCode(true)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" /> Change code
                    </button>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="flex-1 text-xs text-gray-700 font-mono truncate">{referralLink}</span>
                    <CopyButton text={referralLink} />
                    <a href={`https://twitter.com/intent/tweet?text=${tweetText}`} target="_blank" rel="noreferrer"
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-[#1DA1F2] transition-colors">
                        <Twitter className="w-3.5 h-3.5" />
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${fbShare}`} target="_blank" rel="noreferrer"
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-[#1877F2] transition-colors">
                        <Facebook className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Rewards */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Rewards</p>
                <div className="space-y-2">
                    {[
                        '30% recurring commission on every payment from your referrals',
                        'Payouts processed on the 15th of each month via PayPal',
                        'Minimum $20 balance required to receive payout',
                    ].map((r, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-600">{r}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payout / Profile */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Payout details</p>
                    {!editingProfile ? (
                        <button onClick={() => setEditingProfile(true)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                    ) : (
                        <button onClick={() => setEditingProfile(false)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                            <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                    )}
                </div>

                {!editingProfile ? (
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div><span className="text-gray-400 block mb-0.5">Name</span>{referrer.first_name && referrer.last_name ? `${referrer.first_name} ${referrer.last_name}` : <span className="text-gray-400 italic">Not set</span>}</div>
                        <div><span className="text-gray-400 block mb-0.5">PayPal email</span>{referrer.paypal_email || <span className="text-gray-400 italic">Not set</span>}</div>
                        <div className="col-span-2"><span className="text-gray-400 block mb-0.5">Address</span>{referrer.address || <span className="text-gray-400 italic">Not set</span>}</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">First name</label>
                                <input value={profileForm.first_name} onChange={e => setProfileForm((p: any) => ({ ...p, first_name: e.target.value }))}
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900" placeholder="John" />
                            </div>
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last name</label>
                                <input value={profileForm.last_name} onChange={e => setProfileForm((p: any) => ({ ...p, last_name: e.target.value }))}
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900" placeholder="Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">PayPal email</label>
                            <input value={profileForm.paypal_email} onChange={e => setProfileForm((p: any) => ({ ...p, paypal_email: e.target.value }))}
                                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900" placeholder="you@paypal.com" type="email" />
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Address</label>
                            <textarea value={profileForm.address} onChange={e => setProfileForm((p: any) => ({ ...p, address: e.target.value }))}
                                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 resize-none" rows={2} placeholder="123 Main St, City, Country" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleSaveProfile} disabled={savingProfile}
                                className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-gray-700 transition-colors">
                                <Save className="w-3.5 h-3.5" />
                                {savingProfile ? 'Saving...' : 'Save details'}
                            </button>
                            {profileMsg && <p className={`text-xs ${profileMsg === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>{profileMsg}</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* FAQ */}
            <FAQ />
        </div>
    );
}

// ─── REFERRALS TAB ────────────────────────────────────────────────────────────

function ReferralsTab({ referralUsers, loading }: { referralUsers: ReferralUser[]; loading: boolean }) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base font-semibold text-gray-900">Your Referrals</h2>
                <p className="text-xs text-gray-500 mt-0.5">People who signed up using your link. Emails are partially hidden for privacy.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                </div>
            ) : referralUsers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No referrals yet. Share your link to get started!</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-4 py-3 font-medium text-gray-500">#</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Signed up</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referralUsers.map((u, i) => (
                                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                    <td className="px-4 py-3 font-mono text-gray-700">{maskEmail(u.masked_email)}</td>
                                    <td className="px-4 py-3">
                                        {u.converted ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-medium">
                                                <CheckCircle2 className="w-3 h-3" /> Paid customer
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium">
                                                <Clock className="w-3 h-3" /> Free user
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{relTime(u.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── PAYOUTS TAB ──────────────────────────────────────────────────────────────

function PayoutsTab({ payouts, loading, totalEarned, hasPaymentInfo, onGoToProfile }: any) {
    const statusMeta = {
        paid: { label: 'Paid', icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'text-green-700 bg-green-50' },
        pending: { label: 'Pending', icon: <Clock className="w-3.5 h-3.5" />, cls: 'text-amber-700 bg-amber-50' },
        failed: { label: 'Failed', icon: <XCircle className="w-3.5 h-3.5" />, cls: 'text-red-700 bg-red-50' },
    };

    const pendingAmount = payouts.filter((p: Payout) => p.status === 'pending').reduce((a: number, p: Payout) => a + p.amount_cents, 0);
    const paidAmount = payouts.filter((p: Payout) => p.status === 'paid').reduce((a: number, p: Payout) => a + p.amount_cents, 0);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <StatCard icon={<DollarSign className="w-4 h-4 text-green-600" />} label="Total earned" value={fmt$(totalEarned)} />
                <StatCard icon={<Clock className="w-4 h-4 text-amber-600" />} label="Pending payout" value={fmt$(pendingAmount)} />
                <StatCard icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />} label="Total paid out" value={fmt$(paidAmount)} />
            </div>

            {!hasPaymentInfo && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800">Add your PayPal email to receive payouts.</p>
                    </div>
                    <button onClick={onGoToProfile} className="text-xs font-semibold text-amber-700 hover:text-amber-900 ml-4">
                        Add now →
                    </button>
                </div>
            )}

            <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Payout history</h2>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                        <Wallet className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No payouts yet. Keep sharing your link!</p>
                        <p className="text-xs text-gray-400 mt-1">Minimum $20 balance required. Paid on the 15th monthly.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((p: Payout) => {
                                    const meta = statusMeta[p.status];
                                    return (
                                        <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">{fmt$(p.amount_cents)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.cls}`}>
                                                    {meta.icon} {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{p.note || '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── ASSETS TAB ───────────────────────────────────────────────────────────────

function AssetsTab() {
    const assets = [
        { name: 'PrimeClip Logo (PNG)', desc: 'Full color, transparent background', url: '/brand/logo.png', type: 'Logo' },
        { name: 'PrimeClip Logo (SVG)', desc: 'Vector format for any size', url: '/brand/logo.svg', type: 'Logo' },
        { name: 'Logo White (PNG)', desc: 'For dark backgrounds', url: '/brand/logo-white.png', type: 'Logo' },
        { name: 'Banner 1200×628', desc: 'Social media share image', url: '/brand/banner-1200x628.png', type: 'Banner' },
        { name: 'Square 1080×1080', desc: 'Instagram / square post', url: '/brand/square-1080.png', type: 'Banner' },
    ];

    const brandColors = [
        { name: 'Primary', hex: '#000000' },
        { name: 'Accent', hex: '#6366F1' },
        { name: 'Light', hex: '#F9FAFB' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-gray-900">Brand Assets</h2>
                <p className="text-xs text-gray-500 mt-0.5">Official logos and images for promoting PrimeClip.</p>
            </div>

            {/* Brand colors */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Brand Colors</p>
                <div className="flex gap-3">
                    {brandColors.map(c => (
                        <div key={c.name} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md border border-gray-200" style={{ background: c.hex }} />
                            <div>
                                <p className="text-[10px] font-medium text-gray-700">{c.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{c.hex}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Asset downloads */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-700">Downloads</p>
                </div>
                <div className="divide-y divide-gray-50">
                    {assets.map(a => (
                        <div key={a.name} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-900">{a.name}</p>
                                    <p className="text-[10px] text-gray-400">{a.desc}</p>
                                </div>
                            </div>
                            <a
                                href={a.url}
                                download
                                className="flex items-center gap-1 text-[10px] font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-md transition-colors"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Usage Guidelines</p>
                <div className="space-y-2">
                    {[
                        "Don't modify or distort the logo",
                        "Don't use the logo on backgrounds that reduce contrast",
                        "Always link back to primeclip.pro with your referral link",
                        "Don't claim to be affiliated with or employed by PrimeClip",
                    ].map((g, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                            <p className="text-xs text-gray-600">{g}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
    const [open, setOpen] = useState<number | null>(null);
    const faqs = [
        { q: 'When will I get paid?', a: 'Payouts are processed on the 15th of each month via PayPal. You need a minimum balance of $20 to receive a payout.' },
        { q: "What's the referral cookie life?", a: 'The referral cookie lasts 30 days. If someone clicks your link but signs up after 30 days, the conversion won\'t be tracked.' },
        { q: 'Why can\'t I see my sign-ups?', a: 'Tracking is cookie-based. If the user cleared cookies, used incognito, or signed up from a different device, the signup may not be tracked.' },
        { q: 'How is commission calculated?', a: 'You earn 30% of every first payment made by your referrals. Premium ($19) → $5.70 · Ultra ($39) → $11.70.' },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Frequently Asked Questions</p>
            </div>
            <div className="divide-y divide-gray-50">
                {faqs.map((f, i) => (
                    <div key={i}>
                        <button
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                        >
                            <span className="text-xs font-medium text-gray-900">{f.q}</span>
                            <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open === i ? 'rotate-90' : ''}`} />
                        </button>
                        {open === i && (
                            <div className="px-4 pb-3">
                                <p className="text-xs text-gray-500 leading-relaxed">{f.a}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}