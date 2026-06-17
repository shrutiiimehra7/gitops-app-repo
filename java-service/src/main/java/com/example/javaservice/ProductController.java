package com.example.javaservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private static final AtomicLong counter = new AtomicLong();

    private final List<Product> products = new ArrayList<>(List.of(
        new Product(counter.incrementAndGet(), "Laptop Pro", 1299.99, "Electronics"),
        new Product(counter.incrementAndGet(), "Mechanical Keyboard", 149.99, "Peripherals"),
        new Product(counter.incrementAndGet(), "USB-C Hub", 49.99, "Accessories")
    ));

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Fetching all products, count={}", products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Optional<Product> product = products.stream()
            .filter(p -> p.getId().equals(id))
            .findFirst();
        if (product.isEmpty()) {
            logger.warn("Product not found with id={}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("Returning product id={} name={}", id, product.get().getName());
        return ResponseEntity.ok(product.get());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        product.setId(counter.incrementAndGet());
        products.add(product);
        logger.info("Created product id={} name={}", product.getId(), product.getName());
        return ResponseEntity.status(201).body(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean removed = products.removeIf(p -> p.getId().equals(id));
        if (!removed) {
            logger.warn("Delete failed: product not found with id={}", id);
            return ResponseEntity.notFound().build();
        }
        logger.info("Deleted product id={}", id);
        return ResponseEntity.noContent().build();
    }
}
