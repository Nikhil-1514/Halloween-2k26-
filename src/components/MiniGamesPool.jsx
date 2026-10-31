import React, { useEffect } from 'react';
import ReactionTest from './miniGames/ReactionTest';
import PumpkinTap from './miniGames/PumpkinTap';
import CatchBat from './miniGames/CatchBat';
import KeepCandle from './miniGames/KeepCandle';
import HauntedDoor from './miniGames/HauntedDoor';
import DontBlink from './miniGames/DontBlink';
import EscapeWeb from './miniGames/EscapeWeb';
import MemoryDead from './miniGames/MemoryDead';
import HitGhost from './miniGames/HitGhost';
import ZombieChoice from './miniGames/ZombieChoice';
import GraveyardGuess from './miniGames/GraveyardGuess';
import Magic8Ball from './miniGames/Magic8Ball';
import SpiderDodge from './miniGames/SpiderDodge';
import CursedPumpkin from './miniGames/CursedPumpkin';
import MysteryTrick from './miniGames/MysteryTrick';

export default function MiniGamesPool({ gameId, onComplete }) {
  // map gameId to component
  const components = {
    1: ReactionTest,
    2: PumpkinTap,
    3: CatchBat,
    4: KeepCandle,
    5: HauntedDoor,
    6: DontBlink,
    7: EscapeWeb,
    8: MemoryDead,
    9: HitGhost,
    10: ZombieChoice,
    11: GraveyardGuess,
    12: Magic8Ball,
    13: SpiderDodge,
    14: CursedPumpkin,
    15: MysteryTrick,
  };
  const GameComponent = components[gameId] || (() => <div>Unknown Game</div>);

  // When a game signals completion, forward to parent
  const handleDone = (won) => {
    onComplete(won);
  };

  return <GameComponent onDone={handleDone} />;
}
