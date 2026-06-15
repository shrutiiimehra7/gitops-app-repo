package com.example.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final List<Product> products = Arrays.asList(
        new Product(1, "Keyboard", 79.99),
        new Product(2, "Monitor", 299.99),
        new Product(3, "Mouse", 39.99)
    );

    @GetMapping("/")
    public Map<String, String> health() {
        log.info("Health check called");
        Map<String, String> response = new LinkedHashMap<>();
        response.put("status", "healthy");
        response.put("service", "java-api");
        response.put("timestamp", Instant.now().toString());
        return response;
    }

    @GetMapping("/products")
    public Map<String, Object> getProducts() {
        log.info("Fetching all products, count={}", products.size());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("products", products);
        response.put("total", products.size());
        return response;
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(@PathVariable int id) {
        log.info("Fetching product id={}", id);
        return products.stream()
            .filter(p -> p.getId() == id)
            .findFirst()
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> {
                log.warn("Product id={} not found", id);
                return ResponseEntity.status(404)
                    .body(Map.of("error", "Product " + id + " not found"));
            });
    }
}
