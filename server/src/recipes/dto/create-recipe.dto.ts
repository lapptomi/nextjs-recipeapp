export class CreateRecipeDto {
  readonly title: string;
  readonly description: string;
  readonly ingredients: string[];
  readonly cookingTime: number;
  readonly servings: number;
  readonly instructions: string;
}
