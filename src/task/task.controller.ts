import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/create')
  async createTask(@Body() taskData: {taskNumber: number, taskDuration: number, dependencies: number[]}): Promise<string> {
    return await this.taskService.createTask(taskData.taskNumber, taskData.taskDuration, taskData.dependencies);
  }

  @Get('/run')
  async runScheduler() {
    await this.taskService.runScheduler();
  }
}
