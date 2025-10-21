# EmeraldDB Optimization Opportunities

## Already Completed ✓
- Task 1: Removed Bootstrap dependency
- Task 3: Updated critical dependencies
- Task 10: Updated minor versions
- Task 11: Migrated to TanStack Query v5
- Task 13: Fixed type safety issues
- **Task 1 (Optimization): Removed 13 unused dependencies and added clsx**
- **Task 9 (Optimization): Removed unnecessary React imports from 6 files**

## Remaining High-Impact Optimization Tasks

### High Priority (Big Impact, Reasonable Effort)

#### Task 1: Remove Unused Dependencies
**Impact**: Reduces 2.9MB bundle, faster installs, fewer security vulnerabilities
**Effort**: Small
**Files**: `package.json`

**Packages to remove**:
- `@date-io/core` and `@date-io/date-fns` - Not used in codebase
- `@mui/lab` and `@mui/x-date-pickers` - No date picker components found
- `@popperjs/core` - MUI handles this internally
- `ajv`, `buffer`, `process`, `url`, `util` - Polyfills not needed in modern builds
- `postcss` - Handled by build tools
- `prop-types` - Unnecessary with TypeScript
- `react-minimal-pie-chart` - Not found in any component
- `react-rte` - Legacy rich text editor, if still needed should be replaced
- `deep-equal` - Only has type definitions imported

**Packages to add**:
- `clsx` - Used in `src/components/builder/VirtualizedCardTable.tsx` but not in package.json

#### Task 2: Remove Console.log Statements
**Impact**: Better performance, prevents info leakage
**Effort**: Small
**Files**: 15 files with 25+ console statements

**Affected files**:
- `src/views/CardsView.tsx` (line 124: debug statement)
- `src/providers/UiStoreProvider.tsx` (line 51: debug statement)
- `src/utils/createMappersmithHook.ts` (line 51: error logging)
- `src/components/forms/CardEditor.tsx` (line 309: debug statement)
- Multiple admin views and form components with error logging

**Action**: Replace with proper error handling or remove entirely for non-error cases.

#### Task 4: Implement Code Splitting with React.lazy
**Impact**: Massive - reduces initial load from 2.9MB, improves FCP/TTI
**Effort**: Medium
**Files**: `src/Routes.tsx`

**Currently NO lazy loading is implemented**. Large components to code-split:
- `FFGRulesReferenceGuide` (6,606 lines - contains massive embedded content)
- `ELRulesReferenceGuideNew` (fetches and parses AsciiDoc)
- Admin views (only loaded for data admins)
- Deck builder views (authenticated users only)
- `CardsView` and `DecksView` (data-heavy components)

**Implementation**:
```typescript
const FFGRulesReferenceGuide = lazy(() => import('./views/FFGRulesReferenceGuide'))
const ELRulesReferenceGuideNew = lazy(() => import('./views/ELRulesReferenceGuideNew'))
const AdminView = lazy(() => import('./views/AdminView'))
// Wrap with <Suspense fallback={<Loading />}>
```

#### Task 8: Optimize UiStoreProvider Data Loading
**Impact**: Faster initial load, better caching
**Effort**: Medium
**Files**: `src/providers/UiStoreProvider.tsx`

**Current issues**:
- Loads ALL cards, packs, cycles on every mount - causes slow initial load
- Uses multiple sequential API calls in useEffect (lines 38-48)
- No caching beyond component lifetime
- Should integrate with TanStack Query for better caching
- Consider pagination or virtualization for card lists

### Medium Priority

#### Task 5: Add React.memo, useMemo, and useCallback for Performance
**Impact**: Prevents unnecessary re-renders, especially critical for list views with hundreds of cards
**Effort**: Medium

**Currently ONLY 1 file uses memoization**: `src/utils/createMappersmithHook.ts`

**Components needing memoization**:
- `src/views/CardsView.tsx` - Filters and transforms 500+ cards
- `src/components/CardFilter.tsx` - Complex filter state
- `src/components/builder/VirtualizedCardTable.tsx` - Uses PureComponent but child components don't
- `src/components/deck/DeckValidator.ts` - `createDeckStatistics` function (expensive computation)

#### Task 9: Update QueryClient Configuration
**Impact**: Better cache management, fewer unnecessary refetches
**Effort**: Small
**Files**: `src/App.tsx` (line 31)

**Current**: QueryClient created with no configuration

**Should add**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes for cards/packs
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

#### Task 7: Improve Accessibility
**Impact**: Better UX for all users, legal compliance (ADA/WCAG), improved SEO
**Effort**: Medium

**Currently**: Only 1 file has aria-label attributes (`src/components/deck/DecklistTabs.tsx`)

**Missing accessibility features**:
- Icon buttons without aria-labels (search, menu icons in HeaderBar)
- Interactive elements without keyboard navigation
- Card images without alt text
- Form inputs without proper labels
- Color-only indicators for clan/faction (need text alternatives)

### Low Priority (Quick Wins)

#### Task 3: Fix @ts-ignore Comments
**Impact**: Improves type safety, catches potential runtime errors
**Effort**: Small

**Affected files** (2 instances):
- `src/views/ELRulesReferenceGuideNew.tsx` (line 31-32: asciidoctor type issue)
- `src/components/deck/DeckValidator.ts` (line 379-380: DeckStatistics construction)

**Action**:
- Add proper type definitions for asciidoctor library
- Fix DeckStatistics type construction to avoid @ts-ignore

#### Task 6: Remove Unnecessary React Imports
**Impact**: Reduces bundle size slightly, follows React 18 best practices
**Effort**: Small

**Affected**: 18 files still import React unnecessarily in:
- `src/views/`
- `src/components/`
- `src/providers/`

**Details**: With `"jsx": "react-jsx"` in tsconfig, React doesn't need to be imported unless using hooks or other React APIs directly.

#### Task 10: Clean Up TODO Comments
**Impact**: Code maintainability, removes confusion about incomplete migrations
**Effort**: Small

**Affected files** (6 files with TODO comments):
- `src/views/HelpView.tsx` (line 13: JSS-to-styled migration)
- `src/views/FFGRulesReferenceGuide.tsx` (line 27)
- `src/views/DecksView.tsx` (line 19)
- `src/views/CardsView.tsx` (line 34)
- `src/views/ManageCyclesView.tsx` (line 33)
- `src/components/forms/CardEditor.tsx` (line 366: "TODO: Show error")

**Details**: All Root components can remain as divs or be changed to React.Fragment - these TODOs should be resolved or removed.

## Additional Observations

### Test Coverage
**Status**: Zero test files found - no `.test.tsx` or `.spec.ts` files exist
**Impact**: Significant technical debt item

### Bundle Size
**Current**: Main bundle is 2.9MB uncompressed
**Potential**: Code splitting and tree shaking could reduce this by 40-60%

### TypeScript Strictness
**Current**: Config has `"strict": true` which is excellent
**Issue**: The @ts-ignore usage undermines this benefit

### Outdated Packages
Several packages have major version updates available:
- `@date-io/core`: 1.3.6 → 3.2.0
- `react-minimal-pie-chart`: 6.0.1 → 9.1.2
- `react-router-dom`: 6.30.1 → 7.9.4 (but v7 is a major breaking change)

## Recommended Implementation Order

1. **Task 1** (Remove unused dependencies) - Quick win, big bundle size reduction
2. **Task 2** (Remove console.logs) - Quick cleanup
3. **Task 9** (QueryClient config) - Small but important
4. **Task 4** (Code splitting) - Biggest performance impact
5. **Task 8** (Optimize UiStoreProvider) - Requires refactoring
6. **Task 5** (Add memoization) - Prevent re-renders
7. **Task 7** (Accessibility) - Ongoing improvement
