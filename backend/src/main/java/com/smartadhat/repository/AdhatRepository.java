package com.smartadhat.repository;

import com.smartadhat.model.Adhat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdhatRepository extends JpaRepository<Adhat, Long> {
    Optional<Adhat> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

