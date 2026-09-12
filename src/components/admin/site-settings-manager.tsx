"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultSiteSettings, saveSiteSettings, subscribeToSiteSettings, type SiteSettings } from "@/services/site-settings";

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [notice, setNotice] = useState("");

  useEffect(() => subscribeToSiteSettings(setSettings), []);

  async function save() {
    try { await saveSiteSettings(settings); setNotice("Website settings saved. The public site updates immediately."); }
    catch { setNotice("Could not save. Confirm Firebase is configured and this account has the admin claim."); }
  }

  function changePage(slug: string, field: "eyebrow" | "title" | "intro" | "body", value: string) {
    setSettings((current) => ({ ...current, pageContent: { ...current.pageContent, [slug]: { ...current.pageContent[slug], [field]: value } } }));
  }

  return <div className="p-5 pt-20 md:p-8 lg:pt-8">
    <header className="border-b border-white/10 pb-6"><p className="label text-[#c7a66b]">Content Studio</p><h1 className="mt-1 text-3xl font-semibold">Website Settings</h1><p className="mt-1 text-sm text-white/50">Change studio details and every remaining public-page text from one place.</p></header>
    {notice && <p className="mt-5 border border-[#c7a66b]/30 bg-[#c7a66b]/10 p-3 text-sm text-[#d8b77c]">{notice}</p>}
    <section className="mt-6 max-w-4xl space-y-5 border border-white/10 bg-[#161614] p-5">
      <h2 className="text-lg font-medium text-[#c7a66b]">Studio, contact & footer</h2>
      <div className="grid gap-4 sm:grid-cols-2">{([['studioName','Studio name'],['logoUrl','Logo URL'],['phone','Phone'],['email','Email'],['whatsappNumber','WhatsApp number with country code'],['instagramUrl','Instagram URL'],['address','Address'],['copyright','Footer copyright']] as const).map(([key,label]) => <label key={key} className="text-xs text-white/60">{label}<input value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="mt-1 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[#c7a66b]" /></label>)}</div>
    </section>
    <section className="mt-6 max-w-4xl space-y-5 border border-white/10 bg-[#161614] p-5"><h2 className="text-lg font-medium text-[#c7a66b]">Page headings & legal copy</h2>
      {Object.entries(settings.pageContent).map(([slug, page]) => <div key={slug} className="border-t border-white/10 pt-4"><p className="mb-3 text-sm font-medium capitalize text-white">{slug.replaceAll('-', ' ')}</p><div className="grid gap-3 sm:grid-cols-3">{(['eyebrow','title','intro'] as const).map((field) => <label key={field} className="text-xs text-white/60">{field}<input value={page[field] ?? ''} onChange={(e) => changePage(slug, field, e.target.value)} className="mt-1 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[#c7a66b]" /></label>)}</div>{['privacy-policy','terms'].includes(slug) && <label className="mt-3 block text-xs text-white/60">Page body<textarea value={page.body ?? ''} onChange={(e) => changePage(slug, 'body', e.target.value)} rows={3} className="mt-1 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[#c7a66b]" /></label>}</div>)}
    </section>
    <section className="mt-6 max-w-4xl space-y-4 border border-white/10 bg-[#161614] p-5"><h2 className="text-lg font-medium text-[#c7a66b]">Frequently asked questions</h2>{settings.faq.map((item,index) => <div key={index} className="grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-2"><input value={item.question} placeholder="Question" onChange={(e) => setSettings({...settings, faq: settings.faq.map((f,i) => i === index ? {...f, question:e.target.value} : f)})} className="border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[#c7a66b]"/><textarea value={item.answer} placeholder="Answer" onChange={(e) => setSettings({...settings, faq: settings.faq.map((f,i) => i === index ? {...f, answer:e.target.value} : f)})} className="border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[#c7a66b]"/></div>)}<Button variant="outline" onClick={() => setSettings({...settings, faq:[...settings.faq,{question:'',answer:''}]})}>Add question</Button></section>
    <Button onClick={save} className="mt-6">Save all website settings</Button>
  </div>;
}
