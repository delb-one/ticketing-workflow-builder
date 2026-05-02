# 📊 Ticket Monitor – Chart Integration (Queue & Throughput)

## 1. Objective

Enhance the existing `TicketMonitor` UI by adding a real-time chart system that visualizes:

- Queue backlog (L1 / L2 / L3)
- System throughput (tickets completed over time)

This is aligned with the ITSM simulation engine and its multi-agent scheduler.

---

# 2. Design Choice (Important)

We DO NOT compute chart data inside React render.

Instead:

👉 We store a **tick-based history snapshot** inside the Zustand store.

This ensures:

- deterministic simulation
- replayability
- performance stability
- correct time-series rendering

---

# 3. Store Extension

## 3.1 Add Simulation History

Inside your Zustand store:

```ts
type SimulationSnapshot = {
  tick: number;

  queues: {
    l1: number;
    l2: number;
    l3: number;
  };

  throughput: number;

  activeTickets: number;
};