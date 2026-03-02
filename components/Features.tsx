const features = [
  {
    id: 1,
    icon: 'local_shipping',
    title: 'Fast India-Wide Shipping',
    description: 'Free shipping on all orders above ₹5,000 across India.',
  },
  {
    id: 2,
    icon: 'verified',
    title: '100% Genuine Products',
    description: 'Direct partnerships with global enthusiast brands.',
  },
  {
    id: 3,
    icon: 'shield',
    title: 'Secure Payments',
    description: 'SSL protected checkout with UPI, Cards & EMI options.',
  },
];

export default function Features() {
  return (
    <section className="border-y border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-primary">
                {feature.icon}
              </span>
              <h5 className="font-bold">{feature.title}</h5>
              <p className="text-sm text-slate-500 max-w-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

