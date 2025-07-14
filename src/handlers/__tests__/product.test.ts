import request from "supertest";
import server from "../../server";

// Grupo de pruebas para el endpoint de creación de productos
describe("POST /api/products", () => {
  // ✅ Test 1: Validación general con datos vacíos
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toBe(400); // Se espera un error de validación
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4); // Se esperan 4 errores

    // Contrapruebas
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  // ✅ Test 2: Validar que el precio debe ser mayor a 0
  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1); // Solo debe fallar por el precio

    // Contrapruebas
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  // ✅ Test 3: Validar que el precio sea numérico y mayor a 0
  it("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: "hola", // Precio inválido (string)
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2); // Error por tipo y valor

    // Contrapruebas
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  // ✅ Test 4: Crear un producto exitosamente
  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "silla gamer - testing",
      price: 50,
    });

    expect(response.status).toBe(201); // Creado correctamente
    expect(response.body).toHaveProperty("data");

    // Contrapruebas
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

// Grupo de pruebas para obtener todos los productos
describe("GET /api/products", () => {
  // ✅ Test 1: Verificar que la ruta /api/products exista
  it("should check if /api/products URL exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404); // La ruta no debe devolver 404
  });

  // ✅ Test 2: Debería devolver una respuesta JSON con productos
  it("should return a JSON response with the list of products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200); // Se espera éxito
    expect(response.header["content-type"]).toMatch(/json/); // Tipo de respuesta JSON
    expect(response.body).toHaveProperty("data"); // Debe tener una propiedad "data"
    expect(response.body.data).toHaveLength(1); // Se espera al menos 1 producto (ajusta según tu seed)

    // Contrapruebas
    expect(response.status).not.toBe(404); // No debe fallar con 404
    expect(response.body).not.toHaveProperty("errors"); // No debe haber errores
  });
});

//Grupo de pruebas para obtener un producto por ID
describe("GET /api/products/:id", () => {
  // ✅ Test 1: Debería retornar 404 si el producto no existe
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000; // ID que no existe
    const response = await request(server).get(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  // ✅ Test 2: Debería validar el formato del ID y retornar 400 si es inválido
  it("should return 400 if the ID in the URL is invalid", async () => {
    const response = await request(server).get("/api/products/not-valid-url");

    expect(response.status).toBe(400); // Error de validación
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no valido");
  });

  // ✅ Test 3: Debería retornar correctamente los datos de un producto existente
  it("should return a JSON response for a valid existing product", async () => {
    const response = await request(server).get("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data"); // Debe devolver los datos del producto
  });
});


// Grupo de pruebas para actualizar un producto existente por ID
describe("PUT /api/products/:id", () => {

  // ✅ Test 1: Retorna 400 si el ID no tiene un formato válido
  it("should return 400 if the ID in the URL is invalid", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url") // ID no numérico
      .send({
        name: "pc gamer nuevo en caja",
        price: 300,
        availability: true,
      });

    expect(response.status).toBe(400); // Error por ID inválido
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no valido");
  });

  // ✅ Test 2: Retorna errores de validación si no se envía ningún dato
  it("should display validation error message when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({}); // Datos vacíos

    expect(response.status).toBe(400); // Error de validación
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5); // Espera 5 errores (según tus reglas)

    // Contrapruebas
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // ✅ Test 3: Retorna error si el precio es menor o igual a 0
  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "pc gamer nuevo en caja",
      price: 0, // Precio inválido
      availability: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Precio no valido");

    // Contrapruebas
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // ✅ Test 4: Retorna 404 si se intenta actualizar un producto que no existe
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000; // ID que no existe en base de datos
    const response = await request(server).put(`/api/products/${productId}`).send({
      name: "pc gamer nuevo en caja",
      price: 300,
      availability: true,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");

    // Contrapruebas
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  // ✅ Test 5: Actualiza un producto exitosamente si se envían datos válidos
  it("should update an existing product with valid data", async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: "pc gamer nuevo en caja",
      price: 300,
      availability: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data"); // Respuesta correcta con datos actualizados

    // Contrapruebas
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });

});


describe("PATCH /api.products/:id", () => {
  it('should return a 404 response for a non-existing product', async () => {
    const productId = 2000
    const response = await request(server).patch(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto no encontrado')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  it('should update the product availability', async () => {
    const response = await request(server).patch(`/api/products/1`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.availability).toBe(false)

    expect(response.status).not.toBe(404)
    expect(response.body).not.toBe(400)
    expect(response.body).not.toHaveProperty('error')

  })
})


//Grupo de pruebas para eliminar un producto por su ID
describe('DELETE /api/products/:id', () => {

  // ✅ Test 1: Retorna 400 si el ID proporcionado no es válido
  it('should return 400 if the ID in the URL is invalid', async () => {
    const response = await request(server).delete('/api/products/not-valid');

    expect(response.status).toBe(400); // Error de validación por ID no numérico
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('ID no valido');
  });

  // ✅ Test 2: Retorna 404 si se intenta eliminar un producto que no existe
  it('should return a 404 response for a non-existent product', async () => {
    const productId = 2000; // ID que no existe
    const response = await request(server).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404); // Producto no encontrado
    expect(response.body.error).toBe('Producto no encontrado');

    // Contraprueba
    expect(response.status).not.toBe(200);
  });

  // ✅ Test 3: Elimina correctamente un producto existente
  it('should delete a product successfully', async () => {
    const response = await request(server).delete('/api/products/1');

    expect(response.status).toBe(200); // Eliminación exitosa
    expect(response.body.data).toBe('Producto Eliminado');

    // Contrapruebas
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });

});
