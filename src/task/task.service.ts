import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    private readonly dataStored = [{taskNumber: 1,taskDuration: 3,dependencies: [], completed: false},
    {taskNumber: 2,taskDuration: 5,dependencies: [1], completed: false},
    {taskNumber: 3,taskDuration: 2,dependencies: [], completed: false},
    {taskNumber: 4,taskDuration: 4,dependencies: [2, 3], completed: false}];
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

  async runScheduler() {
    const data = this.dataStored;
    data.sort((a: any, b: any) => a.taskDuration - b.taskDuration);
    const promises = [];
    for(let index = 0; index < this.dataStored.length; index +=1) {
        let {
            taskNumber,
            taskDuration,
            dependencies,
            completed
        } = this.dataStored[index];

        let promise;
        console.log(`Task ${taskNumber} Started`)
        if (dependencies.length) { 
            let totalTime = 0;
            for (let i =0; i < dependencies.length; i++) {
                const dependency = dependencies[i];
                this.dataStored.map((ele) => {
                    if(ele.taskNumber === dependency) {
                        totalTime = totalTime + ele.taskDuration;
                    }
                })
            }
            promise = new Promise(function(resolve, reject) {
                setTimeout(function () {
                   completed =  true;
                   resolve(`Task ${taskNumber} Completed`)
                }, taskDuration + totalTime);
            });
        } else {
            promise = new Promise(function(resolve, reject) {
                setTimeout(function () {
                   completed =  true;
                   resolve(`Task ${taskNumber} Completed`)
                }, taskDuration);
            });
        }
        promises.push(promise);
    }
    const result =  await Promise.all(promises);
    result.map((ele) => {
        console.log(ele);
    })
  }
}
