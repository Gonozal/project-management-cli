import { Command, flags } from '@oclif/command';
import { getSdk } from './sdk';
import { cli } from 'cli-ux';
import { table } from 'cli-ux/lib/styled/table';
import client from './client';
import { ErrorHandler } from './errorHandler';

interface DefaultColumnType {
  [key: string]: {};
}

export abstract class BaseCommand extends Command {
  graphql = getSdk(client);
  errorHandler = new ErrorHandler(this.warn);

  static tableFlags = {
    ...cli.table.flags()
  };

  get flags(): flags.Input<any> {
    const constructor = this.constructor as any;
    return constructor.flags;
  }

  table<T extends object>(
    data: T[],
    columns?: table.Columns<T>,
    options?: table.Options
  ): void {
    const { flags } = this.parse({ flags: this.flags });
    if (data.length === 0) {
      this.log(`Query returned no data`);
      return;
    }
    const defaultOptions = {
      printLine: this.log,
      ...flags // default table flags
    };
    if (!columns) {
      columns = this.defaultColumns(data);
    }
    cli.table(data, columns, { ...defaultOptions, ...options });
  }

  private defaultColumns<T extends object>(data: T[]): DefaultColumnType {
    const columns: DefaultColumnType = {};
    data.slice(0, 10).forEach(element => {
      Object.keys(element).forEach(key => {
        if (!columns[key]) {
          columns[key] = {};
        }
      });
    });
    return columns;
  }

  protected async request(): Promise<object[]> {
    return [];
  }

  async run(): Promise<void> {
    try {
      const data = await this.request();
      this.table(data);
    } catch (error) {
      if (error.response?.errors) {
        this.errorHandler.errors = error.response.errors;
        this.errorHandler.displayTree();
      } else {
        console.log(error.message);
      }
    }
  }
}
