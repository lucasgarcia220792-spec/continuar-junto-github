import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Target, TrendingUp, Coins } from 'lucide-react';

interface GameCardProps {
  onBetComplete: () => void;
}

export function GameCard({ onBetComplete }: GameCardProps) {
  const [betAmount, setBetAmount] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<{ won: boolean; multiplier: number; payout: number } | null>(null);
  const { user } = useAuth();

  const playGame = async () => {
    if (!user) return;
    
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido para apostar.',
        variant: 'destructive'
      });
      return;
    }

    setIsPlaying(true);
    setGameResult(null);

    // Simular o jogo - 40% chance de vitória
    const won = Math.random() < 0.4;
    const multiplier = won ? 2.5 : 0;
    const payout = won ? amount * multiplier : 0;

    // Salvar aposta no banco
    const { error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        amount: amount,
        multiplier: multiplier,
        result: won,
        payout: payout
      });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar aposta. Tente novamente.',
        variant: 'destructive'
      });
      setIsPlaying(false);
      return;
    }

    // Simular animação do jogo
    setTimeout(() => {
      setGameResult({ won, multiplier, payout });
      setIsPlaying(false);
      setBetAmount('');
      onBetComplete();
      
      toast({
        title: won ? '🎉 Você ganhou!' : '😔 Você perdeu!',
        description: won 
          ? `Parabéns! Você ganhou R$ ${payout.toFixed(2)}` 
          : `Que pena! Você perdeu R$ ${amount.toFixed(2)}`,
        variant: won ? 'default' : 'destructive',
        className: won ? 'border-secondary' : ''
      });
    }, 3000);
  };

  return (
    <Card className="gaming-card w-full max-w-md border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      
      <CardHeader className="text-center relative z-10">
        <CardTitle className="text-3xl font-orbitron neon-text floating">
          🎰 JOGO DA SORTE
        </CardTitle>
        <CardDescription className="text-lg font-medium">
          Teste sua sorte e ganhe grandes prêmios!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent" />
            Valor da aposta (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={isPlaying}
            className="text-center text-2xl font-bold border-primary/30 focus:border-primary bg-background/50 backdrop-blur"
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('10')}
              disabled={isPlaying}
            >
              R$ 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('50')}
              disabled={isPlaying}
            >
              R$ 50
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('100')}
              disabled={isPlaying}
            >
              R$ 100
            </Button>
          </div>
        </div>

        {isPlaying && (
          <div className="text-center py-8">
            <div className="relative">
              <div className="animate-spin w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-neon-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary animate-pulse-glow" />
              </div>
            </div>
            <p className="text-xl font-orbitron font-bold neon-text animate-pulse-glow">
              GIRANDO A SORTE...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aguarde o resultado...
            </p>
          </div>
        )}

        {gameResult && (
          <div className={`text-center py-6 rounded-xl relative overflow-hidden ${
            gameResult.won 
              ? 'bg-secondary/20 border border-secondary/40' 
              : 'bg-destructive/20 border border-destructive/40'
          }`}>
            <div className="absolute inset-0 animate-pulse opacity-20 bg-current"></div>
            <div className="relative z-10">
              <p className="text-2xl font-orbitron font-black mb-2">
                {gameResult.won ? '🎉 VITÓRIA ÉPICA!' : '💀 TENTE NOVAMENTE!'}
              </p>
              <p className="text-lg font-medium">
                {gameResult.won 
                  ? (
                    <>
                      <span className="gold-text font-bold">Multiplicador: {gameResult.multiplier}x</span>
                      <br />
                      <span className="text-secondary font-bold">Prêmio: R$ {gameResult.payout.toFixed(2)}</span>
                    </>
                  )
                  : 'A sorte está chegando!'
                }
              </p>
            </div>
          </div>
        )}

        <Button 
          onClick={playGame} 
          className="w-full gaming-button font-orbitron font-bold text-xl py-8 relative overflow-hidden group"
          disabled={isPlaying || !betAmount}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-pulse-glow"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isPlaying ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                GIRANDO...
              </>
            ) : (
              <>
                <Target className="h-6 w-6" />
                APOSTAR AGORA
              </>
            )}
          </div>
        </Button>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-orbitron font-bold text-center text-accent">ESTATÍSTICAS DO JOGO</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <Badge variant="outline" className="border-secondary/50 bg-secondary/10">
                <TrendingUp className="mr-1 h-3 w-3" />
                40% Vitória
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-accent/50 bg-accent/10">
                <Zap className="mr-1 h-3 w-3" />
                2.5x Prêmio
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}