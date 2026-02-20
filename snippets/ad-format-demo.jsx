import { useState } from 'react';

export const AdFormatDemo = () => {
  const [experience, setExperience] = useState('CLI');
  const [format, setFormat] = useState('Banner');

  const C = {
    orange: '#FF6B35',
    orangeA20: 'rgba(255,107,53,0.2)',
    orangeA10: 'rgba(255,107,53,0.1)',
    orangeA5: 'rgba(255,107,53,0.05)',
    orangeBorder: 'rgba(255,107,53,0.35)',
    blue: '#60a5fa',
    border: '#2a2a2a',
    bg: '#0f0f0f',
    bg2: '#1a1a1a',
    bg3: '#141414',
    white: '#fff',
    text1: '#e5e7eb',
    text2: '#aaa',
    text3: '#888',
    text4: '#666',
    text5: '#555',
  };

  const ad = {
    advertiser: 'Supabase',
    headline: 'Email/password, magic links, and phone auth.',
    description: 'OAuth providers — Google, GitHub, Discord, and 20+ more.',
    cta: 'Try Free',
  };

  const Badge = () => (
    <span style={{ fontSize: '10px', fontWeight: 700, color: C.orange, backgroundColor: C.orangeA20, padding: '2px 6px', borderRadius: '4px', display: 'inline-block', fontFamily: 'sans-serif', letterSpacing: '0.03em', width: 'fit-content' }}>
      Sponsored
    </span>
  );

  // ── Ad slots ────────────────────────────────────────────────

  const BannerAd = () => (
    <div style={{ padding: '10px 24px', borderTop: `1px solid ${C.border}`, maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ border: `1px solid ${C.orangeBorder}`, borderRadius: '8px', backgroundColor: C.orangeA5, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Badge />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: C.orange, fontWeight: 500, fontFamily: 'sans-serif', fontSize: '13px' }}>{ad.advertiser}</span>
          <span style={{ color: C.text5 }}>—</span>
          <span style={{ color: '#ccc', fontFamily: 'sans-serif', fontSize: '13px' }}>{ad.headline}</span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: C.text3, fontFamily: 'sans-serif', lineHeight: '1.5' }}>{ad.description}</p>
        <a href="#" style={{ margin: 0, fontSize: '12px', color: C.blue, fontFamily: 'sans-serif', textDecoration: 'none' }}>→ {ad.cta}</a>
      </div>
    </div>
  );

  const CardAd = () => (
    <div style={{ padding: '10px 24px', borderTop: `1px solid ${C.border}`, maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ border: `1px solid ${C.orangeBorder}`, borderRadius: '10px', backgroundColor: C.orangeA5, overflow: 'hidden' }}>
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Badge />
          <span style={{ color: C.orange, fontWeight: 600, fontFamily: 'sans-serif', fontSize: '14px' }}>{ad.headline}</span>
          <span style={{ color: C.text3, fontSize: '12px', fontFamily: 'sans-serif' }}>{ad.advertiser}</span>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.text3, fontFamily: 'sans-serif', lineHeight: '1.5' }}>{ad.description}</p>
          <div style={{ marginTop: '6px' }}>
            <a href="#" style={{ display: 'inline-block', padding: '5px 14px', backgroundColor: C.orange, color: C.white, borderRadius: '5px', fontSize: '12px', fontWeight: 600, fontFamily: 'sans-serif', textDecoration: 'none' }}>{ad.cta}</a>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CLI messages ─────────────────────────────────────────────

  const CLIMessages = () => (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ color: C.text5 }}>{'>'}</span>
        <span style={{ color: C.white, fontWeight: 500 }}>How do I add user authentication to my React app?</span>
      </div>

      {format === 'Inline' ? (
        <div style={{ color: C.text2, lineHeight: '1.75' }}>
          <p style={{ margin: '0 0 8px 0' }}>Authentication has a lot of edge cases — sign up, sign in, password reset, session management, and secure token storage.</p>
          <p style={{ margin: 0 }}>
            Popular choices: Auth.js, Clerk, and{' '}
            <a href="#" style={{ color: C.blue, textDecoration: 'none' }}>Supabase Auth →</a>
            {' '}<span style={{ color: C.orange, fontSize: '10px', fontFamily: 'sans-serif' }}>[Sponsored]</span>
            {' '}— all have great React integrations.
          </p>
        </div>
      ) : format === 'Appended' ? (
        <>
          <div style={{ color: C.text2, lineHeight: '1.75' }}>
            <p style={{ margin: '0 0 8px 0' }}>Authentication has a lot of edge cases — sign up, sign in, password reset, session management, and secure token storage.</p>
            <p style={{ margin: 0 }}>Popular choices: Auth.js, Clerk, and Supabase Auth — all have great React integrations.</p>
          </div>
          <div style={{ borderLeft: `2px solid ${C.orangeBorder}`, paddingLeft: '12px' }}>
            <span style={{ color: C.orange, fontSize: '10px', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>SPONSORED · {ad.advertiser}</span>
            <p style={{ margin: '3px 0 0', color: C.text3, fontSize: '12px', fontFamily: 'sans-serif', lineHeight: '1.5' }}>
              {ad.headline} {ad.description}{' '}
              <a href="#" style={{ color: C.blue, textDecoration: 'none' }}>→ {ad.cta}</a>
            </p>
          </div>
        </>
      ) : (
        <div style={{ color: C.text2, lineHeight: '1.75' }}>
          <p style={{ margin: '0 0 8px 0' }}>Authentication has a lot of edge cases — sign up, sign in, password reset, session management, and secure token storage.</p>
          <p style={{ margin: 0 }}>Should I show you how to set up protected routes with the auth context?</p>
        </div>
      )}
    </div>
  );

  // ── Chat messages ────────────────────────────────────────────

  const ChatMessages = () => (
    <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', maxWidth: '72%', color: C.text1, fontSize: '13px', fontFamily: 'sans-serif', lineHeight: '1.55' }}>
          How do I add user authentication to my React app?
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: C.orange, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: C.white, fontFamily: 'sans-serif', fontWeight: 700 }}>AI</div>

        {format === 'Inline' ? (
          <div style={{ backgroundColor: C.bg2, borderRadius: '4px 14px 14px 14px', padding: '10px 14px', maxWidth: '80%', color: C.text2, fontSize: '13px', fontFamily: 'sans-serif', lineHeight: '1.65' }}>
            Authentication has a lot of edge cases — sign up, sign in, password reset, and session management. Popular choice:{' '}
            <a href="#" style={{ color: C.blue, textDecoration: 'none' }}>Supabase Auth <span style={{ fontSize: '9px', color: C.orange }}>[Sponsored]</span></a>
            {' '}— email, magic links, and OAuth in one SDK.
          </div>
        ) : format === 'Appended' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '80%' }}>
            <div style={{ backgroundColor: C.bg2, borderRadius: '4px 14px 14px 14px', padding: '10px 14px', color: C.text2, fontSize: '13px', fontFamily: 'sans-serif', lineHeight: '1.65' }}>
              Authentication has a lot of edge cases — sign up, sign in, password reset, and session management. Popular choices: Auth.js, Clerk, and Supabase Auth.
            </div>
            <div style={{ border: `1px solid ${C.orangeBorder}`, borderRadius: '10px', backgroundColor: C.orangeA5, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Badge />
              <span style={{ color: C.orange, fontWeight: 500, fontSize: '12px', fontFamily: 'sans-serif' }}>{ad.advertiser} · {ad.headline}</span>
              <p style={{ margin: 0, fontSize: '11px', color: C.text3, fontFamily: 'sans-serif', lineHeight: '1.45' }}>{ad.description}</p>
              <a href="#" style={{ fontSize: '11px', color: C.blue, fontFamily: 'sans-serif', textDecoration: 'none' }}>→ {ad.cta}</a>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: C.bg2, borderRadius: '4px 14px 14px 14px', padding: '10px 14px', maxWidth: '80%', color: C.text2, fontSize: '13px', fontFamily: 'sans-serif', lineHeight: '1.65' }}>
            Authentication has a lot of edge cases — sign up, sign in, password reset, and session management. Should I show you how to set up protected routes with the auth context?
          </div>
        )}
      </div>
    </div>
  );

  // ── IDE messages ─────────────────────────────────────────────

  const IDEMessages = () => {
    const kw = '#c586c0';
    const str = '#ce9178';
    const bl = '#569cd6';

    const Line = ({ n, children }) => (
      <div style={{ display: 'flex', whiteSpace: 'pre', lineHeight: '1.65' }}>
        <span style={{ width: '22px', color: C.text4, textAlign: 'right', paddingRight: '10px', flexShrink: 0, userSelect: 'none', fontSize: '11px' }}>{n}</span>
        <span style={{ fontSize: '11px', color: C.text2 }}>{children}</span>
      </div>
    );

    const tree = [
      { indent: 0, arrow: '▸', label: 'src' },
      { indent: 1, arrow: '▸', label: 'components' },
      { indent: 2, label: 'AdDisplay.tsx', active: true },
      { indent: 2, label: 'ChatApp.tsx' },
      { indent: 1, arrow: '▸', label: 'lib' },
      { indent: 2, label: 'thrads.ts' },
      { indent: 1, label: 'App.tsx' },
      { indent: 0, label: 'package.json' },
    ];

    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* File explorer */}
        <div style={{ width: '140px', borderRight: `1px solid ${C.border}`, padding: '12px 8px', flexShrink: 0, overflowY: 'auto', backgroundColor: C.bg }}>
          <div style={{ color: C.text4, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '10px', marginBottom: '10px', paddingLeft: '4px', fontFamily: 'sans-serif' }}>Explorer</div>
          {tree.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: item.active ? '2px 6px' : '2px 4px', paddingLeft: `${item.indent * 10 + (item.active ? 6 : 4)}px`, color: item.active ? C.white : C.text4, backgroundColor: item.active ? '#252525' : 'transparent', borderRadius: item.active ? '4px' : '0', margin: item.active ? '1px -4px' : '0', fontSize: '11px', fontFamily: 'monospace' }}>
              {item.arrow && <span style={{ fontSize: '9px', flexShrink: 0 }}>{item.arrow}</span>}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Code editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ height: '32px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0, backgroundColor: '#111' }}>
            <div style={{ padding: '5px 14px', borderBottom: `2px solid ${C.orange}` }}>
              <span style={{ fontSize: '11px', color: C.white, fontFamily: 'monospace' }}>AdDisplay.tsx</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '14px 8px', overflowY: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
            <Line n={1}><span style={{ color: kw }}>import</span>{' { useState } '}<span style={{ color: kw }}>from</span>{' '}<span style={{ color: str }}>'react'</span></Line>
            <Line n={2}><span style={{ color: kw }}>import</span>{' { fetchAd } '}<span style={{ color: kw }}>from</span>{' '}<span style={{ color: str }}>'../lib/thrads'</span></Line>
            <Line n={3}>{''}</Line>
            <Line n={4}><span style={{ color: kw }}>export function</span>{' AdDisplay({ messages }) {'}</Line>
            <Line n={5}>{'  '}<span style={{ color: kw }}>const</span>{' [ad, setAd] = useState('}<span style={{ color: bl }}>null</span>{')'}</Line>
            <Line n={6}>{'  '}<span style={{ color: kw }}>const</span>{' [loading, setLoading] = useState('}<span style={{ color: bl }}>false</span>{')'}</Line>
            <Line n={7}>{''}</Line>
            <Line n={8}>{'  '}<span style={{ color: kw }}>const</span>{' handleBid = '}<span style={{ color: kw }}>async</span>{' () => {'}</Line>
            <Line n={9}>{'    setLoading('}<span style={{ color: bl }}>true</span>{')'}</Line>
            <Line n={10}>{''}</Line>
            <Line n={11}>{'    '}<span style={{ color: kw }}>const</span>{' { data } = '}<span style={{ color: kw }}>await</span>{' fetchAd({'}</Line>
            <Line n={12}>{'      userId: getUserId(),'}</Line>
            <Line n={13}>{'      chatId: getChatId(),'}</Line>
            <Line n={14}>{'      messages,'}</Line>
            <Line n={15}>{'      production: '}<span style={{ color: bl }}>true</span>{','}</Line>
            <Line n={16}>{'    })'}</Line>
            <Line n={17}>{''}</Line>
            <Line n={18}>{'    setAd(data?.bid ?? '}<span style={{ color: bl }}>null</span>{')'}</Line>
            <Line n={19}>{'    setLoading('}<span style={{ color: bl }}>false</span>{')'}</Line>
            <Line n={20}>{'  }'}</Line>
          </div>
        </div>

        {/* AI chat panel */}
        <div style={{ width: '360px', borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'sans-serif', fontSize: '13px', color: C.text2, minHeight: 0 }}>
            <div style={{ backgroundColor: C.bg2, borderRadius: '8px', padding: '8px 12px', color: C.white, fontSize: '13px' }}>
              How do I add user auth to my React app?
            </div>

            {format === 'Inline' ? (
              <>
                <p style={{ margin: 0 }}>Authentication is tricky — lots of edge cases to handle.</p>
                <p style={{ margin: 0, color: C.text3 }}>
                  Popular choice:{' '}
                  <a href="#" style={{ color: C.blue, textDecoration: 'none' }}>Supabase Auth <span style={{ fontSize: '9px', color: C.orange }}>[Sponsored]</span></a>
                  {' '}— email, magic links, and OAuth in one SDK.
                </p>
              </>
            ) : format === 'Appended' ? (
              <>
                <p style={{ margin: 0 }}>Authentication is tricky — lots of edge cases. Popular choices: Auth.js, Clerk, and Supabase Auth.</p>
                <p style={{ margin: 0, color: C.text3 }}>Should I show you how to set up protected routes?</p>
                <div style={{ border: `1px solid ${C.orangeBorder}`, borderRadius: '8px', backgroundColor: C.orangeA5, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Badge />
                  <span style={{ color: C.orange, fontWeight: 500, fontSize: '12px' }}>{ad.advertiser} · {ad.headline}</span>
                  <p style={{ margin: 0, fontSize: '11px', color: C.text3, lineHeight: '1.4' }}>{ad.description}</p>
                  <a href="#" style={{ fontSize: '11px', color: C.blue, textDecoration: 'none' }}>→ {ad.cta}</a>
                </div>
              </>
            ) : format === 'Card' ? (
              <>
                <p style={{ margin: 0 }}>Authentication is tricky — lots of edge cases. Popular choices: Auth.js, Clerk, and Supabase Auth.</p>
                <p style={{ margin: 0, color: C.text3 }}>Should I show you how to set up protected routes?</p>
                <div style={{ border: `1px solid ${C.orangeBorder}`, borderRadius: '10px', backgroundColor: C.orangeA5, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Badge />
                    <span style={{ color: C.orange, fontWeight: 600, fontSize: '13px' }}>{ad.headline}</span>
                    <span style={{ color: C.text3, fontSize: '11px' }}>{ad.advertiser}</span>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: C.text3, lineHeight: '1.4' }}>{ad.description}</p>
                    <a href="#" style={{ display: 'inline-block', marginTop: '4px', padding: '4px 12px', backgroundColor: C.orange, color: C.white, borderRadius: '5px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', width: 'fit-content' }}>{ad.cta}</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0 }}>Authentication is tricky — lots of edge cases. Popular choices: Auth.js, Clerk, and Supabase Auth.</p>
                <p style={{ margin: 0, color: C.text3 }}>Should I show you how to set up protected routes with the auth context?</p>
              </>
            )}
          </div>

          {/* Input bar */}
          <div style={{ padding: '12px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', backgroundColor: C.bg2, border: `1px solid ${C.border}`, borderRadius: '6px' }}>
              <span style={{ color: C.text4, fontSize: '13px', fontFamily: 'sans-serif', flex: 1 }}>&gt;</span>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: C.text2, fontSize: '12px', fontWeight: 700, lineHeight: 1 }}>↑</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  // ── Cursor / input bar ───────────────────────────────────────

  const CursorBar = () => experience === 'CLI' ? (
    <div style={{ padding: '10px 24px', borderTop: `1px solid ${C.border}`, maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace' }}>
      <span style={{ color: C.text5 }}>{'>'}</span>
      <span style={{ width: '7px', height: '14px', backgroundColor: C.white, display: 'inline-block' }} />
    </div>
  ) : null;

  // ── Compose layout ───────────────────────────────────────────

  const showBottomAd = format === 'Banner' || (format === 'Card' && experience !== 'IDE');
  const Messages = experience === 'CLI' ? CLIMessages : experience === 'Chat' ? ChatMessages : IDEMessages;

  return (
    <div>
      {/* Selectors */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div>
          <span style={{ display: 'block', fontSize: '11px', color: C.text4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'sans-serif' }}>Experience</span>
          <div style={{ display: 'inline-flex', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            {['Chat', 'CLI', 'IDE'].map((exp, i, arr) => (
              <button key={exp} onClick={() => setExperience(exp)} style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', outline: 'none', borderRight: i < arr.length - 1 ? '1px solid #333' : 'none', backgroundColor: experience === exp ? '#1f1f1f' : 'transparent', color: experience === exp ? C.white : C.text4, fontFamily: 'sans-serif', transition: 'color 0.15s, background-color 0.15s' }}>
                {exp}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span style={{ display: 'block', fontSize: '11px', color: C.text4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'sans-serif' }}>Format</span>
          <div style={{ display: 'inline-flex', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            {['Card', 'Inline', 'Appended', 'Banner'].map((fmt, i, arr) => (
              <button key={fmt} onClick={() => setFormat(fmt)} style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', outline: 'none', borderRight: i < arr.length - 1 ? '1px solid #333' : 'none', backgroundColor: format === fmt ? '#1f1f1f' : 'transparent', color: format === fmt ? C.white : C.text4, fontFamily: 'sans-serif', transition: 'color 0.15s, background-color 0.15s' }}>
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', height: '480px', display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto' }}>
        <Messages />
        {showBottomAd && (format === 'Banner' ? <BannerAd /> : <CardAd />)}
        {showBottomAd && <CursorBar />}
      </div>
    </div>
  );
};