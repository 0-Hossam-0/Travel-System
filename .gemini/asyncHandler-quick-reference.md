# AsyncHandler Quick Reference Guide

## Import Statement
```typescript
import { asyncHandler } from "../../utils/asyncHandler";
```

## Basic Usage

### Simple Route Handler
```typescript
router.get("/endpoint", asyncHandler(async (req: Request, res: Response) => {
  const data = await Service.getData();
  return successResponse(res, { data });
}));
```

### Route Handler with Middleware
```typescript
router.post(
  "/endpoint",
  authMiddleware,
  validateRequest(schema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await Service.createData(req.body);
    return successResponse(res, { data: result, statusCode: 201 });
  })
);
```

### Throwing Errors
```typescript
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const item = await Service.getById(req.params.id);
  
  // Throw custom exceptions - asyncHandler will catch them
  if (!item) throw new NotFoundException("Item not found");
  
  return successResponse(res, { data: item });
}));
```

### With MongoDB Transactions
```typescript
router.post(
  "/endpoint",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await Service.createWithTransaction(req.body, session);
      await session.commitTransaction();
      return successResponse(res, { data: result });
    } catch (error) {
      await session.abortTransaction();
      throw error; // asyncHandler catches this
    } finally {
      session.endSession();
    }
  })
);
```

### Wrapping Service Functions
```typescript
// If your service function already handles req and res
router.post("/login", validateRequest(LoginSchema), asyncHandler(login));
```

## Common Patterns

### Pattern 1: GET Single Resource
```typescript
router.get("/:id", asyncHandler(async (req, res) => {
  const resource = await Service.getById(req.params.id);
  if (!resource) throw new NotFoundException("Resource not found");
  return successResponse(res, { data: resource });
}));
```

### Pattern 2: GET Collection with Pagination
```typescript
router.get("/", asyncHandler(async (req, res) => {
  const { items, meta } = await Service.getAll(req.query);
  return successResponse(res, { data: items, info: meta });
}));
```

### Pattern 3: POST Create Resource
```typescript
router.post(
  "/",
  authMiddleware,
  validateRequest(createSchema),
  asyncHandler(async (req, res) => {
    const newResource = await Service.create(req.body);
    return successResponse(res, { 
      data: newResource, 
      statusCode: 201,
      message: "Created successfully" 
    });
  })
);
```

### Pattern 4: PATCH Update Resource
```typescript
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateSchema),
  asyncHandler(async (req, res) => {
    const updated = await Service.update(req.params.id, req.body);
    if (!updated) throw new NotFoundException("Resource not found");
    return successResponse(res, { 
      data: updated,
      message: "Updated successfully" 
    });
  })
);
```

### Pattern 5: DELETE Resource
```typescript
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await Service.delete(req.params.id);
    return successResponse(res, { 
      message: "Deleted successfully" 
    });
  })
);
```

## Best Practices

✅ **DO:**
- Always use `asyncHandler` for async route handlers
- Throw errors instead of calling `next(error)` inside asyncHandler-wrapped functions
- Use custom exception classes (NotFoundException, BadRequestException, etc.)
- Keep transaction logic inside try-catch blocks when using MongoDB sessions

❌ **DON'T:**
- Don't call `next(error)` manually inside asyncHandler - just throw the error
- Don't wrap non-async functions with asyncHandler
- Don't forget to import asyncHandler when creating new route handlers
- Don't use try-catch for regular async operations (asyncHandler handles it)

## Error Handling Flow

```
1. Error thrown in route handler
   ↓
2. AsyncHandler catches the error
   ↓
3. Error passed to next(error)
   ↓
4. Global error handler processes it
   ↓
5. Formatted error response sent to client
```

## Migration Checklist

When migrating existing route handlers to use asyncHandler:

- [ ] Import asyncHandler at the top of the controller file
- [ ] Wrap the async route handler function with asyncHandler()
- [ ] Replace `next(error)` with `throw error` in catch blocks
- [ ] Replace `return new NotFoundException()` with `throw new NotFoundException()`
- [ ] Remove unnecessary try-catch blocks (except for transactions)
- [ ] Test the endpoint to ensure error handling works correctly

## Example: Before & After

### Before
```typescript
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tour = await TourService.getTourById(req.params.id);
    if (!tour) {
      return next(new NotFoundException("Tour not found"));
    }
    return successResponse(res, { data: tour });
  } catch (error) {
    next(error);
  }
});
```

### After
```typescript
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const tour = await TourService.getTourById(req.params.id);
  if (!tour) throw new NotFoundException("Tour not found");
  return successResponse(res, { data: tour });
}));
```

## Questions?

If you encounter any issues or have questions about using asyncHandler:
1. Check the implementation in `utils/asyncHandler.ts`
2. Review examples in existing controllers
3. Refer to the full documentation in `.gemini/asyncHandler-implementation-summary.md`
