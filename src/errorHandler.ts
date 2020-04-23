import {
  ApolloClassValidatorError,
  GeneralizedError,
  HandledErrors
} from './errors/generalizedError';

import { Tree } from 'cli-ux/lib/styled/tree';
import { cli } from 'cli-ux';

export class ErrorHandler {
  private _errors: ApolloClassValidatorError[] = [];
  public errorTree: Tree;

  private readonly logger: (message?: string, ...args: any[]) => void;

  constructor(logger = console.warn) {
    this.errorTree = cli.tree();
    this.logger = logger;
  }

  public set errors(errors: ApolloClassValidatorError[]) {
    this._errors = errors;
    this.generateTree();
  }

  public get errors(): ApolloClassValidatorError[] {
    return this._errors;
  }

  public displayTree(): void {
    this.errorTree.display(this.logger);
  }

  private generateTree(): void {
    this.errors.forEach(error => {
      this.errorTree.insert(error.message);
      if (error.extensions === undefined) return;
      const subTree = cli.tree();
      const subErrors = this.generalizedSubErrors(error);
      subErrors.forEach(subError => {
        subTree.insert(subError.message, subError.tree);
      });
      this.errorTree.insert(error.message, subTree);
    });
  }

  private generalizedSubErrors(
    error: ApolloClassValidatorError
  ): GeneralizedError[] {
    const { validationErrors, errors } = error.extensions.exception;
    return [...(validationErrors || []), ...(errors || [])].map(
      (handledError: HandledErrors) => {
        return new GeneralizedError(handledError);
      }
    );
  }
}
