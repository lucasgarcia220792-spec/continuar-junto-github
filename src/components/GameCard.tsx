import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
        variant: won ? 'default' : 'destructive'
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">🎰 Jogo da Sorte</CardTitle>
        <CardDescription>
          Faça sua aposta e teste sua sorte!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor da aposta (R$)</label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={isPlaying}
          />
        </div>

        {isPlaying && (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Rodando o jogo...</p>
          </div>
        )}

        {gameResult && (
          <div className={`text-center py-4 rounded-lg ${
            gameResult.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-lg font-bold">
              {gameResult.won ? '🎉 VITÓRIA!' : '😔 DERROTA!'}
            </p>
            <p className="text-sm">
              {gameResult.won 
                ? `Multiplicador: ${gameResult.multiplier}x | Prêmio: R$ ${gameResult.payout.toFixed(2)}`
                : 'Tente novamente na próxima!'
              }
            </p>
          </div>
        )}

        <Button 
          onClick={playGame} 
          className="w-full"
          disabled={isPlaying || !betAmount}
        >
          {isPlaying ? 'Jogando...' : 'Apostar'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>Probabilidade de vitória: 40%</p>
          <p>Multiplicador de vitória: 2.5x</p>
        </div>
      </CardContent>
    </Card>
  );
}