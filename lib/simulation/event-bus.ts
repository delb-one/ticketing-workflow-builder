import type { SimulationEvent } from './types';

type Listener = (event: SimulationEvent) => void;

export class SimulationEventBus {
  private listeners: Listener[] = [];

  emit(event: SimulationEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((activeListener) => activeListener !== listener);
    };
  }

  clear(): void {
    this.listeners = [];
  }
}
