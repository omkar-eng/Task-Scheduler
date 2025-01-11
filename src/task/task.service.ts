import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    private readonly maxConcurrent = 2;
    private dataStored = [{ taskNumber: 1, taskDuration: 3, dependencies: [], completed: false },
    { taskNumber: 2, taskDuration: 5, dependencies: [1], completed: false },
    { taskNumber: 3, taskDuration: 2, dependencies: [], completed: false },
    { taskNumber: 4, taskDuration: 4, dependencies: [2, 3], completed: false }];
    getHello(): string {
        return 'Hello World!';
    }

    async createTask(taskNumber: number, taskDuration: number, dependencies: number[]): Promise<string> {
        const obj = {
            taskNumber,
            taskDuration,
            dependencies,
            completed: false
        }
        this.dataStored.push(obj);
        return `Task is created`;
    }

    async runTask(dataStored) {
        console.log(`Task ${dataStored.taskNumber} started`);
        await new Promise(resolve => setTimeout(resolve, dataStored.taskDuration * 10));
        console.log(`Task ${dataStored.taskNumber} completed`);
        dataStored.completed = true;
    }

    async runScheduler() {
        const runningTasks: Promise<void>[] = [];
        while (this.dataStored.length > 0) {
            for (const task of this.dataStored) {
                if (!task.completed && task.dependencies.every(dep => this.dataStored[dep - 1].completed)) {
                    if (runningTasks.length < this.maxConcurrent) {
                        runningTasks.push(this.runTask(task));
                    }
                }
            }
            if (runningTasks.length > 0) {
                await Promise.race(runningTasks);
                this.dataStored = this.dataStored.filter(task => !task.completed);
            } else {
                break;
            }
        }

        await Promise.all(runningTasks);
    }
}
