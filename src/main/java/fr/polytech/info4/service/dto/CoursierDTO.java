package fr.polytech.info4.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link fr.polytech.info4.domain.Coursier} entity.
 */
public class CoursierDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String surname;

    @NotNull
    private String transportMean;

    @NotNull
    @Size(min = 10, max = 10)
    @Pattern(regexp = "[0-9]*")
    private String phone;

    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getTransportMean() {
        return transportMean;
    }

    public void setTransportMean(String transportMean) {
        this.transportMean = transportMean;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CoursierDTO)) {
            return false;
        }

        CoursierDTO coursierDTO = (CoursierDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, coursierDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CoursierDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", surname='" + getSurname() + "'" +
            ", transportMean='" + getTransportMean() + "'" +
            ", phone='" + getPhone() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
