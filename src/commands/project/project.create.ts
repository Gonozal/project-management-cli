import { BaseCommand } from '../../base';
import { flags } from '@oclif/parser';

export default class ProjectCreate extends BaseCommand {
  static description = 'Project Index';

  static aliases: string[] = ['project:create', 'project:new'];

  static flags = {
    name: flags.string({ char: 'n', required: true }),
    key: flags.string({ char: 'n' })
  };

  async generateProjectKey(name: string): Promise<string> {
    const data = await this.graphql.getProjectKey({ name });
    return data.defaultProjectKey;
  }

  async request() {
    const { flags } = this.parse(ProjectCreate);
    if (!flags.key) {
      flags.key = await this.generateProjectKey(flags.name);
    }

    const data = await this.graphql.createProject({
      createProjectInput: flags
    });
    if (data.createProject) {
      this.log('Successfuly created Project:');
      return [data.createProject];
    }
    return [];
  }
}
