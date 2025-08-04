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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">🎰 Bet Win Spark</h1>
            <p className="text-xl text-muted-foreground mb-6">
              A plataforma de apostas mais emocionante!
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg" className="px-8">
              Entrar / Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🎰 Bet Win Spark</h1>
          <p className="text-muted-foreground">Faça suas apostas e ganhe prêmios incríveis!</p>
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
      </div>
    </div>
  );
};

export default Index;
