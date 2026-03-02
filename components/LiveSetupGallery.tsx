'use client';

import { useState } from 'react';

const setupItems = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2szADM5ISIXlgO-jmeh_WgCinJ9UftMKB7j6hbRvTZD5ugGjePtpr6m6DVHlXAPcWT6auCrnysq7_CpQwCJnpNpXlF2CwFWG46ax5ECUikI41JhnjQiN_2MxhxVr4VP_vnIIKjaaWwjTH7fUC2MvhBjuJL2RWLMZXlW9j-wgVELmIfI4q2tkSXebnBWq05UTZ9Rh8jilVaLs2osLyifV7aJuTcEgQyi5mJEZ2CK_sUwrFtxkOuHmN7uvsM8f-3Y_3Dq09Cx5Zgvfo',
    username: '@codex_pro',
    views: '2.4k views',
    hasVideo: true,
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
    username: '@dev_vibes',
    views: '1.8k views',
    hasVideo: true,
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
    username: '@minimal_java',
    views: '4.1k views',
    hasVideo: false,
  },
  {
    id: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
    username: '@rust_and_neon',
    views: '952 views',
    hasVideo: false,
  },
  {
    id: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnDBW3fSizAUrZ3rDyY0N8oBsxZTcTyXhEnkE-quqlp2znS6pBe13Nc6ooE1Y67L5DivsQxEUa1YeI9BY2KEeGEz4bziPlw29DdC3AlrEGO7RWx9xG7voi8pKEz0xKLSAL_eCZrN5rKS1ufnWR1If-JnGZbDfz2os0oftjy-7YvpN73BhPYBFUYonV0HU6KDUBEvEwblDHfIZpQb5a4YXQbP_jbeIBsY1hnxyPdXNd7WCrbn3PFzswOpEVckWI2HmHDPhhu-Ki7qG',
    username: '@pixel_push',
    views: '3.2k views',
    hasVideo: false,
  },
];

export default function LiveSetupGallery() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">Live Setup Gallery</h3>
          <p className="text-slate-400">Hover to see these battle-stations in action.</p>
        </div>
        <button className="text-accent-green font-bold text-sm flex items-center gap-1 hover:underline">
          Share Yours
          <span className="material-symbols-outlined text-sm">upload</span>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {setupItems.map((item) => (
          <div
            key={item.id}
            className="gallery-item relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-slate-800 border border-white/5"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              alt={`Setup ${item.id}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                hoveredItem === item.id && item.hasVideo ? 'opacity-0' : 'opacity-100'
              }`}
              src={item.image}
            />
            {item.hasVideo && (
              <video
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                }`}
                loop
                muted
                playsInline
                autoPlay={hoveredItem === item.id}
              >
                <source src="#" type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
              <span className="text-xs font-bold text-white mb-1">{item.username}</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-green text-sm fill-1">
                  favorite
                </span>
                <span className="text-[10px] text-slate-300">{item.views}</span>
              </div>
            </div>
            {item.hasVideo && (
              <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur rounded-full">
                <span className="material-symbols-outlined text-white text-xs">play_arrow</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

