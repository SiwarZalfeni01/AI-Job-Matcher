package com.aijobmatcher.repository;

import com.aijobmatcher.model.CV;
import com.aijobmatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CVRepository extends JpaRepository<CV, Long> {
    List<CV> findByUser(User user);
    Optional<CV> findByUserAndId(User user, Long id);
}
