import { TodoForm, TodoList } from "./components";

export function TodoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">我的任务</h1>
        <p className="text-muted-foreground text-sm">管理你今天要完成的事项</p>
      </div>
      <TodoForm />
      <TodoList />
    </div>
  );
}
