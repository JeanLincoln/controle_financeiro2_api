# Backend origin return report

## Resumo
- Corrigi o contrato de criação de origem para que `POST /origin` retorne a origem criada.
- Ajustei a assinatura do repositório, a implementação TypeORM, o use case e o controller para propagar `Origin`.
- Atualizei o teste do use case e o stub do repositório para refletirem o novo contrato.

## Causa raiz
- `OriginRepository.create` retornava `Promise<void>`.
- `CreateOriginUseCase.execute` também retornava `Promise<void>`.
- O controller já repassava o resultado do use case, mas recebia `undefined`, então o endpoint respondia sem a origem criada.

## Arquivos alterados
- `src/domain/repositories/origin.repository.ts`
- `src/infra/repositories/origin/origin.repository.ts`
- `src/use-cases/origin/create/create.use-case.ts`
- `src/infra/controllers/origin/origin.controller.ts`
- `src/use-cases/origin/create/create.spec.ts`
- `test/stubs/repositories/origin.ts`
- `.superpowers/sdd/backend-origin-return-report.md`

## Verificações
- Red: `pnpm test src/use-cases/origin/create/create.spec.ts --runInBand` falhou com `Received: undefined`.
- Green: `pnpm test src/use-cases/origin/create/create.spec.ts --runInBand` passou.
- Tipagem: `pnpm exec tsc --noEmit` passou.

## Impacto
- O frontend pode usar a resposta de `POST /origin` para auto-selecionar a origem recém-criada.
- O bloqueio load-bearing apontado na revisão da Task 2 foi removido por ajuste de contrato de API.
