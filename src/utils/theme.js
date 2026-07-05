export const getCampusStyle = (campusId) => {
  switch (campusId) {
    case 'ust':
      return {
        bg: 'bg-[#FBC02D]', // UST Gold
        text: 'text-slate-900',
        border: 'border-[#FBC02D]',
        hoverBg: 'hover:bg-[#F57F17]',
        ring: 'focus:ring-[#FBC02D]',
        shadow: 'shadow-[#FBC02D]/30',
        badge: 'bg-[#FBC02D]/10 text-[#C49000] border-[#FBC02D]/35'
      };
    case 'feu':
      return {
        bg: 'bg-[#004D40]', // FEU Green
        text: 'text-white',
        border: 'border-[#004D40]',
        hoverBg: 'hover:bg-[#00332c]',
        ring: 'focus:ring-[#004D40]',
        shadow: 'shadow-[#004D40]/25',
        badge: 'bg-[#004D40]/10 text-[#004D40] border-[#004D40]/30'
      };
    case 'ue':
      return {
        bg: 'bg-[#D32F2F]', // UE Red
        text: 'text-white',
        border: 'border-[#D32F2F]',
        hoverBg: 'hover:bg-[#B71C1C]',
        ring: 'focus:ring-[#D32F2F]',
        shadow: 'shadow-[#D32F2F]/25',
        badge: 'bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30'
      };
    case 'nu':
      return {
        bg: 'bg-[#0F3B7C]', // NU Blue
        text: 'text-white',
        border: 'border-[#0F3B7C]',
        hoverBg: 'hover:bg-[#0A2A59]',
        ring: 'focus:ring-[#0F3B7C]',
        shadow: 'shadow-[#0F3B7C]/25',
        badge: 'bg-[#0F3B7C]/10 text-[#0F3B7C] border-[#0F3B7C]/30'
      };
    case 'ceu':
      return {
        bg: 'bg-[#E91E63]', // CEU Pink
        text: 'text-white',
        border: 'border-[#E91E63]',
        hoverBg: 'hover:bg-[#C2185B]',
        ring: 'focus:ring-[#E91E63]',
        shadow: 'shadow-[#E91E63]/25',
        badge: 'bg-[#E91E63]/10 text-[#E91E63] border-[#E91E63]/30'
      };
    case 'sanbeda':
      return {
        bg: 'bg-[#B71C1C]', // San Beda Red
        text: 'text-white',
        border: 'border-[#B71C1C]',
        hoverBg: 'hover:bg-[#7F0000]',
        ring: 'focus:ring-[#B71C1C]',
        shadow: 'shadow-[#B71C1C]/25',
        badge: 'bg-[#B71C1C]/10 text-[#B71C1C] border-[#B71C1C]/30'
      };
    default:
      return {
        bg: 'bg-amber-500',
        text: 'text-white',
        border: 'border-amber-500',
        hoverBg: 'hover:bg-amber-600',
        ring: 'focus:ring-amber-500',
        shadow: 'shadow-amber-500/20',
        badge: 'bg-amber-50 text-amber-800 border-amber-200'
      };
  }
};
