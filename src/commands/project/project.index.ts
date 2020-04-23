import { BaseCommand } from '../../base';
import * as Parser from '@oclif/parser';

export default class ProjectIndex extends BaseCommand {
  static description = 'Project Index';

  static aliases: string[] = ['project:list', 'project:index'];

  static args: Parser.args.IArg[] = [{ name: 'file' }, { name: 'other-file' }];

  async run(): Promise<void> {
    const { projects } = await this.graphql.getProjects();

    this.table(projects);
  }
}
