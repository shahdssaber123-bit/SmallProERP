import React from 'react';
import { Menu } from 'lucide-react';
export default function Topbar({ title, subtitle, actions }) { return <header className="mb-8 flex items-center justify-between gap-4"><div className="flex items-center gap-4"><button className="rounded-xl p-2 text-slate-500 lg:hidden"><Menu /></button><div><h1 className="text-3xl font-black text-slate-950">{title}</h1>{subtitle && <p className="text-slate-500">{subtitle}</p>}</div></div>{actions && <div className="flex gap-2">{actions}</div>}</header>; }
