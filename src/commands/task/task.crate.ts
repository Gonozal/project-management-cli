import { BaseCommand } from '../../base';
import { flags } from '@oclif/parser';

export default class TaskCreate extends BaseCommand {
  static description = 'Project Index';

  static aliases: string[] = ['task:create', 'task:new'];

  static flags = {
    name: flags.string({ char: 'n', required: true }),
    projectKey: flags.string({ char: 'p', required: true })
  };

  async request() {
    const { flags } = this.parse(TaskCreate);
    const data = await this.graphql.createTask({
      createTaskInput: flags
    });
    if (data.createTask) {
      this.log('Successfuly created Task:');
      return [data.createTask];
    }
    return [];
  }
}
