import { ValidationError } from 'class-validator';
import { cli } from 'cli-ux';
import { ApolloError } from 'apollo-server-errors';

export interface SequelizeValidationErrorItem {
  instance: Record<string, any>;
  message: string;
  path: string;
  type: string;
  validatorArgs: string;
  validatorKey: string;
  validatorName: string;
  value: string;
}

export interface ApolloClassValidatorError extends ApolloError {
  extensions: {
    code: string;
    exception: {
      validationErrors?: ValidationError[];
      errors?: SequelizeValidationErrorItem[];
      stackTrace: string[];
    };
  };
}

export type HandledErrors = ValidationError | SequelizeValidationErrorItem;

export class GeneralizedError {
  public value?: string;
  public key!: string;
  public messages!: string[];

  public constructor(error: HandledErrors) {
    if ('instance' in error) {
      this.processSequelizeError(error);
    } else {
      this.processValidationError(error);
    }
  }

  private processSequelizeError(error: SequelizeValidationErrorItem) {
    this.value = error.value;
    this.key = error.path;
    this.messages = [error.message];
  }

  private processValidationError(error: ValidationError) {
    this.key = error.property;
    this.value = error.value;
    if (error.constraints) {
      this.messages = Object.entries<string>(error.constraints).map(
        ([key, val]) => {
          return val;
        }
      );
    } else {
      this.messages = [];
    }
  }

  public get tree() {
    const tree = cli.tree();
    this.messages.forEach(message => tree.insert(message));
    return tree;
  }

  public get message(): string {
    return `Failed Validation of { ${this.key}: "${this.value}" }`;
  }
}
