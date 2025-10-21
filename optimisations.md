# EmeraldDB Optimization Opportunities

## Executive Summary
This document outlines optimization opportunities identified across the EmeraldDB application, covering performance, architecture, library usage, and code quality improvements.

---

## 🎯 High Priority Optimizations

### 1. Replace Deprecated `react-virtualized` Library
**Issue:** Using deprecated `react-virtualized` (last updated 2019)
**Impact:** Security vulnerabilities, no future updates, performance issues
**Solution:**
- Migrate to `@tanstack/react-virtual` (modern, maintained, better performance)
- Smaller bundle size (~5KB vs ~30KB)
- Better TypeScript support
**Files Affected:** `client/src/components/builder/VirtualizedCardTable.tsx`
**Estimated Impact:** High - 25KB bundle reduction, better performance

### 2. Memoize Expensive Filter Operations
**Issue:** `applyFilters` function runs on every render without memoization
**Impact:** Filters entire card collection (potentially 1000+ items) repeatedly
**Solution:**
```typescript
const filteredCards = useMemo(
  () => applyFilters(cards, formats, filter),
  [cards, formats, filter]
)
```
**Files Affected:**
- `client/src/components/builder/BuilderCardList.tsx`
- `client/src/views/CardsView.tsx`
**Estimated Impact:** High - 30-50% faster filtering on large datasets

### 3. Optimize `validCardVersionForFormat` Function
**Issue:** Linear search through all cards/formats on every call
**Current:** O(n) lookup in `UiStoreProvider.tsx`
**Solution:**
```typescript
const cardVersionCache = useMemo(() => {
  const cache = new Map<string, Map<string, CardInPack>>()
  // Build lookup table
  return cache
}, [cards, formats])
```
**Files Affected:** `client/src/providers/UiStoreProvider.tsx`
**Estimated Impact:** Medium - Faster card lookups in deck builder

### 4. Add API Response Caching (Backend)
**Issue:** No caching for frequently accessed, rarely changing data
**Solution:**
- Add Redis or in-memory cache for `/api/cards`, `/api/packs`, etc.
- Add `Cache-Control` headers
- Implement ETag support
**Example:**
```typescript
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300') // 5 minutes
  }
  next()
})
```
**Files Affected:** `src/app.ts`, `src/api.ts`
**Estimated Impact:** High - Reduce server load by 60-80%

---

## 📦 Library & Bundle Optimizations

### 5. Replace Full Lodash with Individual Imports
**Current:** Importing entire lodash library (~70KB)
**Solution:**
```typescript
// Before
import lodash from 'lodash'

// After
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
```
**Estimated Impact:** Medium - Save ~40-50KB in bundle

### 6. Replace Mappersmith with Modern Fetch/Axios
**Issue:** Mappersmith is niche, adds ~20KB, less type-safe
**Solution:** Use native fetch with wrapper or axios
```typescript
// Simple fetch wrapper with TanStack Query
const fetchApi = async (endpoint: string) => {
  const response = await fetch(`/api${endpoint}`)
  if (!response.ok) throw new Error('API Error')
  return response.json()
}
```
**Files Affected:** `client/src/api.ts`, all API calls
**Estimated Impact:** Medium - 15-20KB reduction, better DX

### 7. Remove Unnecessary Browser Polyfills
**Issue:** Including Node.js polyfills unnecessarily increases bundle
**Current:** `buffer`, `process`, `stream-browserify`, `http-browserify`, etc.
**Solution:** Remove if not needed, or use specific polyfills only where required
**Files Affected:** `client/package.json`, webpack config
**Estimated Impact:** Medium - 30-40KB reduction

### 8. Evaluate `material-ui-confirm` Necessity
**Issue:** Small library (~5KB) that duplicates MUI Dialog functionality
**Solution:** Use MUI's built-in Dialog with custom confirm hook
**Estimated Impact:** Low - 5KB reduction, reduced dependencies

---

## ⚡ Performance Optimizations

### 9. Implement Code Splitting & Lazy Loading
**Issue:** Entire app loads on initial page load
**Solution:**
```typescript
const CardsView = lazy(() => import('./views/CardsView'))
const DeckEditor = lazy(() => import('./components/builder/DeckEditor'))
const AdminView = lazy(() => import('./views/AdminView'))
```
**Files Affected:** `client/src/Routes.tsx`
**Estimated Impact:** High - 40-60% faster initial load

### 10. Optimize getAllCards Handler (Backend)
**Issue:** Inefficient array operations, linear searches
**Current Code:**
```typescript
allCardsInPacks.forEach((cardInPack) =>
  allCardsWithVersions
    .find((card) => card.id === cardInPack.card_id) // O(n) lookup!
    ?.versions.push({ ...cardInPack })
)
```
**Solution:**
```typescript
const cardMap = new Map(allCardsWithVersions.map(c => [c.id, c]))
allCardsInPacks.forEach((cardInPack) => {
  cardMap.get(cardInPack.card_id)?.versions.push({ ...cardInPack })
})
```
**Files Affected:** `src/handlers/getAllCards.ts`
**Estimated Impact:** Medium - 50-70% faster with 1000+ cards

### 11. Add Debouncing to Text Search
**Issue:** Filter updates on every keystroke
**Solution:** Use `useDebounce` hook (already available)
**Files Affected:** `client/src/components/CardFilter.tsx`
**Estimated Impact:** Low - Better UX, fewer re-renders

### 12. Implement Virtual Scrolling for Card Images
**Issue:** Loading all card images at once in image mode
**Solution:** Use intersection observer or react-virtual
**Files Affected:** `client/src/components/builder/BuilderCardList.tsx`
**Estimated Impact:** High - Much faster with 100+ cards in image mode

---

## 🏗️ Architectural Improvements

### 13. Add Compression Middleware (Backend)
**Issue:** No gzip/brotli compression for API responses
**Solution:**
```typescript
import compression from 'compression'
app.use(compression())
```
**Files Affected:** `src/app.ts`
**Estimated Impact:** High - 70-80% smaller response sizes

### 14. Add Rate Limiting (Backend)
**Issue:** No protection against API abuse
**Solution:**
```typescript
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)
```
**Files Affected:** `src/app.ts`
**Estimated Impact:** Medium - Better security, server protection

### 15. Reduce JSON Payload Limit
**Issue:** 200MB limit is excessive and security risk
**Current:** `app.use(express.json({ limit: '200mb' }))`
**Solution:** Reduce to 10-50MB based on actual needs
**Files Affected:** `src/app.ts`
**Estimated Impact:** Low - Better security

### 16. Convert Class Components to Functional Components
**Issue:** MuiVirtualizedTable uses outdated class component pattern
**Solution:** Refactor to functional component with hooks
**Files Affected:** `client/src/components/builder/VirtualizedCardTable.tsx`
**Estimated Impact:** Low - Better maintainability, potential performance gain

---

## 🔧 Code Quality Improvements

### 17. Add Proper Error Boundaries
**Issue:** No error boundaries, app crashes propagate to user
**Solution:** Wrap route components in ErrorBoundary
**Estimated Impact:** Medium - Better UX, easier debugging

### 18. Implement Proper Loading States
**Issue:** Some components don't show loading indicators
**Solution:** Use TanStack Query's `isLoading` consistently
**Files Affected:** Various components
**Estimated Impact:** Low - Better UX

### 19. Add Database Connection Pooling Config
**Issue:** Default Knex connection pool might not be optimized
**Solution:**
```typescript
{
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  }
}
```
**Files Affected:** `knexfile.js`
**Estimated Impact:** Low-Medium - Better database performance

### 20. Implement Sentry/Error Tracking Integration
**Issue:** `@sentry/node` is installed but might not be properly configured
**Solution:** Ensure proper Sentry initialization and error tracking
**Files Affected:** `src/index.ts`
**Estimated Impact:** Low - Better production debugging

---

## 📊 Monitoring & Metrics

### 21. Add Performance Monitoring
**Recommendation:**
- Use React DevTools Profiler in development
- Add web-vitals monitoring
- Track bundle size over time
**Tools:** `web-vitals`, `webpack-bundle-analyzer`

### 22. Database Query Optimization
**Recommendation:**
- Add query logging in development
- Identify N+1 queries
- Add database indexes where needed

---

## 🎯 Quick Wins (Low Effort, High Impact)

1. **Add compression middleware** (15 minutes) - 70% size reduction
2. **Memoize applyFilters** (30 minutes) - 50% faster filtering
3. **Add Cache-Control headers** (15 minutes) - Reduce server load
4. **Replace lodash imports** (1 hour) - 40KB bundle reduction
5. **Add rate limiting** (20 minutes) - Better security

---

## 📈 Expected Overall Impact

### Bundle Size Reduction
- **Current (estimated):** ~800KB gzipped
- **After optimizations:** ~600KB gzipped
- **Improvement:** 25% reduction

### Performance Improvements
- **Initial Load Time:** 40-60% faster
- **Filter Operations:** 30-50% faster
- **API Response Time:** 60-80% faster with caching
- **Server Load:** 70% reduction with caching

### Developer Experience
- Better type safety
- Easier maintenance
- Modern patterns and libraries

---

## 🚀 Implementation Priority

### Phase 1 (Week 1): Quick Wins
- Add compression middleware
- Memoize filter operations
- Add Cache-Control headers
- Fix lodash imports

### Phase 2 (Week 2-3): Library Updates
- Replace react-virtualized
- Evaluate mappersmith replacement
- Remove unnecessary polyfills

### Phase 3 (Week 4-5): Architecture
- Add caching layer
- Implement code splitting
- Optimize backend handlers

### Phase 4 (Ongoing): Code Quality
- Refactor class components
- Add error boundaries
- Improve loading states

---

## 📝 Notes

- Some optimizations may require testing across different browsers
- Database optimizations should be tested with production data volumes
- Bundle size measurements should be done with production builds
- Performance testing should include realistic data sets (1000+ cards)

---

*Document created: 2025*
*Last reviewed: [Date of review]*
