import React from 'react';
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface ExpensiverLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  onClick?: () => void;
  className?: string;
}

const ExpensiverLogo = ({ 
  size = 'md', 
  showText = true, 
  variant = 'default',
  onClick,
  className = ''
}: ExpensiverLogoProps) => {
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-lg',
      icon: 'w-5 h-5',
      gap: 'gap-3'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-xl',
      icon: 'w-6 h-6',
      gap: 'gap-3'
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-2xl',
      icon: 'w-8 h-8',
      gap: 'gap-4'
    }
  };

  const variantConfig = {
    default: {
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      hoverGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      textPrimary: 'text-white',
      textSecondary: 'text-white/80',
      hoverTextPrimary: 'text-emerald-300',
      shadow: 'shadow-lg shadow-emerald-500/25'
    },
    white: {
      gradient: 'from-white via-gray-100 to-gray-200',
      hoverGradient: 'from-gray-100 via-white to-gray-100',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      hoverTextPrimary: 'text-emerald-600',
      shadow: 'shadow-lg shadow-gray-300/50'
    },
    dark: {
      gradient: 'from-gray-800 via-gray-900 to-black',
      hoverGradient: 'from-gray-700 via-gray-800 to-gray-900',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      hoverTextPrimary: 'text-emerald-400',
      shadow: 'shadow-lg shadow-black/50'
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  return (
    <div 
      className={`flex items-center ${currentSize.gap} ${onClick ? 'cursor-pointer' : ''} group transition-all duration-300 ${onClick ? 'hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Logo Icon Container */}
      <div className={`
        relative ${currentSize.container} rounded-xl 
        bg-gradient-to-br ${currentVariant.gradient}
        flex items-center justify-center 
        ${currentVariant.shadow}
        group-hover:shadow-xl 
        transition-all duration-300
        overflow-hidden
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Hover Effect Overlay */}
        <div className={`
          absolute inset-0 rounded-xl 
          bg-gradient-to-br ${currentVariant.hoverGradient}
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
        `}></div>
        
        {/* Main Icon - Stylized 'E' with Financial Elements */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative">
            {/* Letter 'E' with integrated chart elements */}
            <svg 
              width={currentSize.icon.split(' ')[0].slice(2)} 
              height={currentSize.icon.split(' ')[0].slice(2)} 
              viewBox="0 0 24 24" 
              fill="none"
              className="text-white"
            >
              {/* Main 'E' structure */}
              <path 
                d="M4 4h12M4 4v16M4 12h8M4 20h12" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
              {/* Integrated trend arrow */}
              <path 
                d="M18 8l2-2m0 0l-2-2m2 2h-4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-90"
              />
              {/* Small dollar sign accent */}
              <circle cx="17" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" className="opacity-80" />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`
            font-bold ${currentSize.text} leading-tight 
            ${currentVariant.textPrimary} 
            ${onClick ? `group-hover:${currentVariant.hoverTextPrimary}` : ''} 
            transition-colors duration-300
            tracking-tight
          `}>
            Expensiver
          </span>
          {size !== 'sm' && (
            <span className={`
              ${currentVariant.textSecondary} 
              ${size === 'xl' ? 'text-sm' : 'text-xs'} 
              font-medium 
              -mt-1
              tracking-wide
            `}>
              Smart Expense Tracker
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Alternative compact logo for small spaces
export const ExpensiverCompactLogo = ({ 
  size = 'md', 
  variant = 'default',
  onClick,
  className = ''
}: Omit<ExpensiverLogoProps, 'showText'>) => {
  const sizeConfig = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const variantConfig = {
    default: {
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      shadow: 'shadow-md shadow-emerald-500/25'
    },
    white: {
      gradient: 'from-white via-gray-100 to-gray-200',
      shadow: 'shadow-md shadow-gray-300/50'
    },
    dark: {
      gradient: 'from-gray-800 via-gray-900 to-black',
      shadow: 'shadow-md shadow-black/50'
    }
  };

  return (
    <div 
      className={`
        ${sizeConfig[size]} rounded-lg 
        bg-gradient-to-br ${variantConfig[variant].gradient}
        flex items-center justify-center 
        ${variantConfig[variant].shadow}
        ${onClick ? 'cursor-pointer hover:scale-110' : ''} 
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      <span className="text-white font-bold text-sm">E</span>
    </div>
  );
};

export default ExpensiverLogo;