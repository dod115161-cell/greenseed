export default function Footer({settings}){return(<footer className="bg-slate-950 border-t border-emerald-900/60 text-slate-400 mt-10 py-6 text-sm text-center">
<p className="font-medium">{settings.name}</p><p>Hotline: {settings.hotline} • Kho: {settings.address}</p></footer>)}
