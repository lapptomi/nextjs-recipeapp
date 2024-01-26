package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.example.demo.dto.NewUserDTO;
import com.example.demo.models.User;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    NewUserDTO toDTO(User user);

    User toEntity(NewUserDTO userDTO);
}
