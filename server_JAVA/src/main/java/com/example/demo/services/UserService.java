package com.example.demo.services;

import com.example.demo.dto.NewUserDTO;
import com.example.demo.mapper.UserMapper;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    S3Service s3Service;

    @Autowired
    PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.getRecipes().forEach(recipe -> {
            if (recipe.getImage() != null) {
                recipe.setImage(s3Service.createPresignedGetUrl(recipe.getImage()));
            }
        });
        return userRepository.findById(id).orElseThrow();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public User create(NewUserDTO user) {
        User userEntity = UserMapper.INSTANCE.toEntity(user);
        userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(userEntity);
    }
}
