<<<<<<< HEAD
// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
=======
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GameCard } from '@/components/GameCard';
import { UserProfile } from '@/components/UserProfile';
import { BetHistory } from '@/components/BetHistory';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBetComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-orbitron font-black neon-text floating">
              🎰 BET WIN SPARK
            </h1>
            <p className="text-2xl font-medium gold-text pulse-glow">
              A plataforma de apostas mais emocionante do universo!
            </p>
            <p className="text-lg text-muted-foreground">
              Junte-se a milhares de jogadores e ganhe prêmios incríveis
            </p>
          </div>
          <Link to="/auth">
            <Button className="gaming-button font-orbitron font-bold text-2xl px-12 py-8 animate-neon-pulse">
              🚀 ENTRAR NO JOGO
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-orbitron font-black neon-text floating mb-4">
            🎰 BET WIN SPARK
          </h1>
          <p className="text-xl gold-text pulse-glow">
            Faça suas apostas e ganhe prêmios épicos!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="space-y-6">
            <UserProfile onSignOut={handleSignOut} refreshTrigger={refreshTrigger} />
          </div>
          
          <div className="flex justify-center">
            <GameCard onBetComplete={handleBetComplete} />
          </div>
          
          <div className="space-y-6">
            <BetHistory refreshTrigger={refreshTrigger} />
          </div>
        </div>
>>>>>>> existing/main
      </div>
    </div>
  );
};

export default Index;
