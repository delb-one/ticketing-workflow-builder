# Ticketing Workflow Builder

A visual workflow builder for prototyping ITSM (IT Service Management) ticket lifecycles using drag-and-drop blocks powered by React Flow.

## Features

- **Visual Workflow Editor**: Drag and drop blocks to design ticket workflows
- **Block Library**: Pre-built blocks for common ITSM operations:
  - **Flow Control**: Start, End, Decision, Condition
  - **Actors**: L1/L2/L3 Tech, Client, Supervisor
  - **Actions**: Resolve, Validate, Close
  - **Automation**: SLA Timer, Escalation, Auto-Assign, Notify, Business Rules, Reopen
  - **Status**: Open, In Progress, Pending, Resolved, Closed, Reopened
  - **Events**: Custom event triggers
- **Simulation Engine**: Test and validate your workflows with a built-in simulation engine
- **Real-time Feedback**: Visual feedback during simulation with event logging
- **Decision Handling**: Interactive decision dialogs for manual routing
- **Dark/Light Theme**: Toggle between themes for better visibility

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI Library**: React 19
- **Workflow Visualization**: React Flow (@xyflow/react)
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The application will be available at `http://localhost:3000`

## Usage

### Building a Workflow

1. **Drag Blocks**: Drag blocks from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles to create connections
3. **Configure Nodes**: Select a node to edit its properties in the Inspector Panel
4. **Label Edges**: Double-click on edges to add labels (useful for decision outcomes)

### Simulating a Workflow

1. Click **Start Simulation** in the Simulation Panel
2. Watch the workflow execute step-by-step
3. Make decisions when prompted at decision nodes
4. View the event log to track the ticket's journey

### Node Types

| Type | Description |
|------|-------------|
| Start | Entry point of the workflow |
| End | Termination point |
| Actor | Represents a role (L1/L2/L3 tech, client, supervisor) |
| Action | Ticket actions (resolve, validate, close) |
| Automation | Automated processes (SLA, escalation, notifications) |
| Decision | Manual or rule-based branching |
| Condition | Conditional logic evaluation |
| Status | Ticket state changes |
| Event | Custom event triggers |

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── BlockLibrary.tsx   # Draggable block palette
│   ├── CanvasNode.tsx     # Custom node rendering
│   ├── InspectorPanel.tsx # Node property editor
│   ├── SimulationPanel.tsx# Simulation controls
│   ├── Toolbar.tsx        # Top toolbar
│   └── WorkflowCanvas.tsx # React Flow canvas
├── lib/                   # Core logic
│   ├── blocks/            # Block definitions and registry
│   ├── simulation/        # Workflow simulation engine
│   │   ├── engine.ts      # Main simulation engine
│   │   ├── types.ts       # TypeScript definitions
│   │   └── node-handlers.ts # Node execution handlers
│   └── store.ts           # Zustand state management
└── hooks/                 # Custom React hooks
```

## Simulation Engine

The built-in simulation engine (`lib/simulation/engine.ts`) provides:

- **Step-by-step Execution**: Navigate through workflow steps
- **Ticket State Management**: Tracks ticket state, priority, assignments, and SLA
- **Event System**: Emits events for workflow actions (created, assigned, resolved, etc.)
- **Decision Handling**: Pauses for manual decisions at decision nodes
- **History Tracking**: Records complete workflow execution history

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## License

MIT
