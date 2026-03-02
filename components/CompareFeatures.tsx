const features = [
  {
    id: 1,
    icon: 'local_shipping',
    title: 'Pan-India Delivery',
    description: 'Fast and secure shipping to over 25,000+ pin codes across India.',
  },
  {
    id: 2,
    icon: 'verified_user',
    title: 'Authentic Gear Only',
    description: 'All products are sourced directly from authorized brand distributors.',
  },
  {
    id: 3,
    icon: 'support_agent',
    title: '24/7 Tech Support',
    description: 'Our team of experts is ready to help you with your custom setup.',
  },
];

export default function CompareFeatures() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.id} className="flex gap-4">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
          </div>
          <div>
            <h4 className="font-bold mb-1">{feature.title}</h4>
            <p className="text-sm text-slate-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

