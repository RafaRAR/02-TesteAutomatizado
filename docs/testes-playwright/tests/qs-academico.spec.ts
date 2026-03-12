import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.locator('#tabela-alunos tbody tr').first().locator('td').nth(0)).toHaveText('João Silva')
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  test.describe('Validação de notas', () => {

    test('deve rejeitar notas fora do intervalo', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Jaime Santos');
      await page.getByLabel('Nota 1').fill('12');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste = page.getByText('As notas devem estar entre 0 e');
      await expect(teste).toHaveText('As notas devem estar entre 0 e 10.');
    });

  });

  test.describe('Validação de filtro de busca', () => {

    test('deve exibir apenas o nome buscado', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Tonhão');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Igor');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('textbox', { name: 'Buscar por nome' }).fill('Tonhão');

      const teste = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(0);
      await expect(teste).toHaveText('Tonhão');
    });

  });

  test.describe('Validação de exclusão', () => {

    test('deve excluir aluno', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Gordinho');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir Gordinho' }).click();

      const teste = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(0);
      await expect(teste).toHaveText('Nenhum aluno cadastrado.');
    });

  });

  test.describe('Validação de estatística', () => {

    test('deve ter numero correto de aprovados/reprovados/recuperação', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Gordinho');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Tonhão');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('2');
      await page.getByLabel('Nota 3').fill('1');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Igor');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('5');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste1 = page.getByTestId('total-aprovados').getByText('1');
      const teste2 = page.getByTestId('total-recuperacao').getByText('1');
      const teste3 = page.getByTestId('total-reprovados').getByText('1');

      await expect(teste1).toHaveText('1');
      await expect(teste2).toHaveText('1');
      await expect(teste3).toHaveText('1');

    });

  });

  test.describe('Validação de aprovado', () => {

    test('Aluno Aprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Gordinho');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste = page.getByTestId('aluno-1').getByText('Aprovado');
      await expect(teste).toHaveText('Aprovado');

    });

  });

  test.describe('Validação de reprovado', () => {

    test('Aluno Reprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Tonhão');
      await page.getByLabel('Nota 1').fill('1');
      await page.getByLabel('Nota 2').fill('3');
      await page.getByLabel('Nota 3').fill('1');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste = page.getByTestId('aluno-1').getByText('Reprovado');
      await expect(teste).toHaveText('Reprovado');

    });

  });

  test.describe('Validação de multiplo cadastros', () => {

    test('Multiplos Alunos Cadastrados', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Gordinho');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Tonhão');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('2');
      await page.getByLabel('Nota 3').fill('1');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Igor');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('5');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste = page.locator('#tabela-alunos tbody tr');
      await expect(teste).toHaveCount(3);

    });

  });

  test.describe('Validação de Recuperação', () => {

    test('Aluno Recuperação', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Gordinho');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('5');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const teste = page.getByTestId('aluno-1').getByText('Recuperação');
      await expect(teste).toHaveText('Recuperação');

    });

  });

});