const communityReviews = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2szADM5ISIXlgO-jmeh_WgCinJ9UftMKB7j6hbRvTZD5ugGjePtpr6m6DVHlXAPcWT6auCrnysq7_CpQwCJnpNpXlF2CwFWG46ax5ECUikI41JhnjQiN_2MxhxVr4VP_vnIIKjaaWwjTH7fUC2MvhBjuJL2RWLMZXlW9j-wgVELmIfI4q2tkSXebnBWq05UTZ9Rh8jilVaLs2osLyifV7aJuTcEgQyi5mJEZ2CK_sUwrFtxkOuHmN7uvsM8f-3Y_3Dq09Cx5Zgvfo',
    username: '@tech_guru',
    comment: '"The build quality on this custom build is insane. Best desk upgrade this year."',
    likes: '1.2k',
    comments: 48,
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVA_-B12wrZHmkzZ0JS_w6YqBEeiWUHL-yo3FEwx9c9gXaJTZSRmBDVKQi4WgAoT1pgIxToDSiT6FRcVKmxerqeO-f9IYBLjIf0ZuyfqFNRhxhDS5Kuo3dGmO2L1BWOd88iu9s6hysFVNVyYWJ_qsjVHKMTsKJeYiMca5mmQ-CvDEDa-H62n7_lAGLE0RXrB0xGRSjU24V7KGl_DwmxjY830FIxC9VpaX14WXWTlwTLNARvo7gzXP97WcgP6hiEXeD8KwXmgJVHRyT',
    username: '@mechanical_mind',
    comment: '"Testing out the sound profile of these new tactile switches. Satisfying!"',
    likes: '856',
    comments: 32,
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
    username: '@desk_setups',
    comment: '"Minimalism at its peak. The Keychron K2 fits perfectly in my setup."',
    likes: '2.4k',
    comments: 120,
  },
  {
    id: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
    username: '@pro_workflow',
    comment: '"Switching to MX Master 3S was the best productivity decision I\'ve made."',
    likes: '642',
    comments: 15,
  },
  {
    id: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXnDBW3fSizAUrZ3rDyY0N8oBsxZTcTyXhEnkE-quqlp2znS6pBe13Nc6ooE1Y67L5DivsQxEUa1YeI9BY2KEeGEz4bziPlw29DdC3AlrEGO7RWx9xG7voi8pKEz0xKLSAL_eCZrN5rKS1ufnWR1If-JnGZbDfz2os0oftjy-7YvpN73BhPYBFUYonV0HU6KDUBEvEwblDHfIZpQb5a4YXQbP_jbeIBsY1hnxyPdXNd7WCrbn3PFzswOpEVckWI2HmHDPhhu-Ki7qG',
    username: '@clicky_keys',
    comment: '"The weight of the Model O- is just ridiculous. Feels like nothing in hand."',
    likes: '980',
    comments: 29,
  },
  {
    id: 6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
    username: '@custom_cables_in',
    comment: '"That pop of color from the aviator cable is the cherry on top."',
    likes: '533',
    comments: 9,
  },
];

export default function CommunityReviews() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">Community Reviews</h3>
          <p className="text-slate-500 text-sm">
            Authentic setup showcases from our premium community.
          </p>
        </div>
        <a
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          href="#"
        >
          Follow @JioCoder
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {communityReviews.map((review) => (
          <div
            key={review.id}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              alt={`Video Review ${review.id}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={review.image}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:opacity-0">
              <span className="material-symbols-outlined text-white text-4xl opacity-80">
                play_circle
              </span>
            </div>
            <div className="absolute inset-0 video-overlay opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-xs">{review.username}</span>
              </div>
              <p className="text-white text-[10px] leading-tight line-clamp-2 mb-2 italic">
                {review.comment}
              </p>
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs fill-1">favorite</span>
                  <span className="text-[10px] font-bold">{review.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">chat_bubble</span>
                  <span className="text-[10px] font-bold">{review.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

