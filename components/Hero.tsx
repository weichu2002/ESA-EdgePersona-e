import React from 'react';
import { ArrowRight, Cpu, Network, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-edge-900 text-white p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-edge-accent blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 max-w-4xl text-center space-y-8">
        <div className="flex justify-center items-center gap-2 mb-4">
           <span className="px-3 py-1 border border-edge-accent/30 rounded-full text-xs font-mono text-edge-glow bg-edge-800/50 backdrop-blur-sm">
             ESA Edge Computing Powered
           </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
          ESA EdgePersona
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
          构建你的动态数字人格镜像。一个持续学习、人格演化的私人数字生命体。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left my-12">
          <FeatureCard 
            icon={<Cpu className="w-6 h-6 text-edge-glow" />}
            title="边缘计算驱动"
            desc="逻辑与记忆在离你最近的节点运行，实现零延迟思考。"
          />
          <FeatureCard 
            icon={<Network className="w-6 h-6 text-edge-glow" />}
            title="动态人格进化"
            desc="不是静态的快照，而是随你每日交互而成长的生命。"
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-edge-glow" />}
            title="数据主权"
            desc="完全私有化部署，你的数字灵魂只属于你自己。"
          />
        </div>

        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-edge-accent/10 hover:bg-edge-accent/20 border border-edge-accent/50 text-edge-glow rounded-lg font-semibold transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden"
        >
          <span className="relative z-10">初始化数字生命</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-edge-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-xl bg-edge-800/40 border border-edge-700/50 backdrop-blur-sm hover:border-edge-accent/30 transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default Hero;
