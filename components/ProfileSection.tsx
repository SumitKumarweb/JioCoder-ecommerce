type ProfileSectionProps = {
  name?: string;
  email?: string;
  memberSince?: string;
  location?: string;
  avatarSrc?: string;
};

export default function ProfileSection({
  name = 'Arjun Sharma',
  email = 'arjun.sharma@email.in',
  memberSince = 'October 2023',
  location = 'New Delhi, India',
  avatarSrc = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLT21FFSdlLSLAzBVh3QOo3Th76aMvAg9l8BKF20Jb0inMV6BwSZYiRXKxHA2vLXXCgG1c5dG5RVo7Y6aTmx8F6K14y46aBeKfieYaz7Zn2U4CQ0OYKZxYNZT4Z1e5tZFoDxFBifdE0noYfF-mb4739Rv_6TLapQh6DAtombZ661JNrR0uHpaHGi8zZRD8iAGt2XCe2xijfduzAtdigc2lt8nGFBblGT-RhptJ5iJNJiP2GXrJCjHxZ_IgKmdas9hTmVQQA8NPVOeM',
}: ProfileSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="relative">
          <div className="size-28 md:size-32 rounded-full border-4 border-primary/20 p-1">
            <img
              className="w-full h-full object-cover rounded-full"
              alt={`${name} profile photo`}
              src={avatarSrc}
            />
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 size-10 bg-primary text-white rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Change profile photo"
          >
            <span className="material-symbols-outlined text-xl">camera_alt</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h2>
          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
            <span className="material-symbols-outlined text-sm">mail</span>
            {email}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Member since {memberSince} • {location}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            View Public Profile
          </button>
        </div>
      </div>
    </section>
  );
}

